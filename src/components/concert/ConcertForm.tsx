"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ---------- ZOD VALIDATION ----------
const concertSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(5000),
  artist: z.string().min(1),
  genre: z.enum([
    "Pop",
    "Rock",
    "Classical",
    "Jazz",
    "Electronic",
    "Hip Hop",
    "Other",
  ]),

  startTime: z.string().min(1),
  endTime: z.string().min(1),

  theaterId: z.string().min(1),

  totalTickets: z.number().min(1),
  basePrice: z.number().min(0),

  isPublished: z.boolean().default(false),

  imageUrl: z.string().optional(),
  additionalDetails: z.string().max(2000).optional(),

  tags: z.string().optional(), // comma-separated -> ["tag1","tag2"]

  images: z.any().optional(),
});

export type ConcertFormType = z.infer<typeof concertSchema>;

// ---------- COMPONENT ----------
export default function ConcertForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ConcertFormType>({
    resolver: zodResolver(concertSchema),
    defaultValues: {
      isPublished: false,
    },
  });

  const submitHandler: SubmitHandler<ConcertFormType> = (data) => {
    const finalData = {
      ...data,
      tags: data.tags?.split(",").map((t) => t.trim()),
      images: data.images,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6 p-4">

      {/* Title */}
      <div>
        <label>Title</label>
        <input className="input" {...register("title")} />
        <p className="error">{errors.title?.message}</p>
      </div>

      {/* Description */}
      <div>
        <label>Description</label>
        <textarea className="input" rows={4} {...register("description")} />
        <p className="error">{errors.description?.message}</p>
      </div>

      {/* Artist */}
      <div>
        <label>Artist</label>
        <input className="input" {...register("artist")} />
        <p className="error">{errors.artist?.message}</p>
      </div>

      {/* Genre */}
      <div>
        <label>Genre</label>
        <select className="input" {...register("genre")}>
          <option value="Pop">Pop</option>
          <option value="Rock">Rock</option>
          <option value="Classical">Classical</option>
          <option value="Jazz">Jazz</option>
          <option value="Electronic">Electronic</option>
          <option value="Hip Hop">Hip Hop</option>
          <option value="Other">Other</option>
        </select>
        <p className="error">{errors.genre?.message}</p>
      </div>

      {/* Start Time */}
      <div>
        <label>Start Time</label>
        <input type="datetime-local" className="input" {...register("startTime")} />
        <p className="error">{errors.startTime?.message}</p>
      </div>

      {/* End Time */}
      <div>
        <label>End Time</label>
        <input type="datetime-local" className="input" {...register("endTime")} />
        <p className="error">{errors.endTime?.message}</p>
      </div>

      {/* Theater */}
      <div>
        <label>Theater</label>
        <input className="input" placeholder="Theater ID" {...register("theaterId")} />
        <p className="error">{errors.theaterId?.message}</p>
      </div>

      {/* Total Tickets */}
      <div>
        <label>Total Tickets</label>
        <input type="number" className="input" {...register("totalTickets", { valueAsNumber: true })} />
        <p className="error">{errors.totalTickets?.message}</p>
      </div>

      {/* Base Price */}
      <div>
        <label>Base Price</label>
        <input type="number" className="input" {...register("basePrice", { valueAsNumber: true })} />
        <p className="error">{errors.basePrice?.message}</p>
      </div>

      {/* Image URL */}
      <div>
        <label>Image URL (Optional)</label>
        <input className="input" {...register("imageUrl")} />
      </div>

      {/* Additional Details */}
      <div>
        <label>Additional Details</label>
        <textarea className="input" rows={3} {...register("additionalDetails")} />
        <p className="error">{errors.additionalDetails?.message}</p>
      </div>

      {/* Tags */}
      <div>
        <label>Tags (comma separated)</label>
        <input className="input" {...register("tags")} />
      </div>

      {/* Images Upload */}
      <div>
        <label>Upload Images</label>
        <input type="file" multiple {...register("images")} />
      </div>

      {/* Publish Toggle */}
      <div className="flex items-center gap-2">
        <label>Publish</label>
        <input type="checkbox" {...register("isPublished")} />
      </div>

      {/* Submit */}
      <button type="submit" className="btn-primary">
        Save Concert
      </button>
    </form>
  );
}

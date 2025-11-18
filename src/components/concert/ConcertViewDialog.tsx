import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Music, DollarSign, Info } from "lucide-react";
import { IConcertDisplay } from "@/lib/types";
import { getConcertImageUrl } from "@/lib/imageUtils";

interface ConcertViewDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  concert: IConcertDisplay | null;
}

export function ConcertViewDialog({ open, setOpen, concert }: ConcertViewDialogProps) {
  if (!concert) return null;

  const image = getConcertImageUrl(concert);

  const theaterName =
    typeof concert.theaterId === "object"
      ? concert.theaterId?.name
      : concert.theaterId;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-xl">
        <DialogHeader className="p-5 pb-2">
          <DialogTitle className="text-xl font-bold">
            Concert Details
          </DialogTitle>
          <DialogClose />
        </DialogHeader>

        {/* 🎵 Hero Image */}
        <div className="w-full h-56 overflow-hidden">
          <img
            src={image}
            alt="Concert Image"
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        <Card className="border-none shadow-none">
          <CardContent className="p-6 space-y-6">

            {/* Title + Artist */}
            <div>
              <h2 className="text-2xl font-bold">{concert.title}</h2>
              <p className="text-gray-600 text-sm">{concert.artist}</p>
            </div>

            {/* Genre + Published */}
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1 text-xs">
                {concert.genre}
              </Badge>

              {concert.isPublished ? (
                <Badge className="bg-green-600 text-white">Published</Badge>
              ) : (
                <Badge className="bg-gray-400">Draft</Badge>
              )}
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">Schedule</p>
                <p className="text-sm text-gray-600">
                  {concert.startTime} → {concert.endTime}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-gray-600">{theaterName}</p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">Base Price</p>
                <p className="text-sm text-gray-600">
                  ${concert.basePrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium">Description</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {concert.description}
                </p>
              </div>
            </div>

          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

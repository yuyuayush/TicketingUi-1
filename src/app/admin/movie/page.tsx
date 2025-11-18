"use client";

import { useState, useMemo } from "react";
// Import the movie hooks you provided in the prompt
import {
  useGetMovies,
  useCreateMovie,
  useUpdateMovie,
  useDeleteMovie,
} from "@/hooks/useMovie";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Eye, // Added for View Details
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// ========================================================
//  Custom Hook: useMovieForm
// ========================================================
interface MovieFormData {
  title: string;
  description: string;
  duration: number | string;
  genre: string;
  releaseDate: string; // YYYY-MM-DD
  trailerUrl: string;
  cast: string; // Comma-separated string of actors
  posterImage: string;
  movieImages: string; // Comma-separated string of image URLs
}

function useMovieForm() {
  const [formData, setFormData] = useState<MovieFormData>({
    title: "",
    description: "",
    duration: "",
    genre: "",
    releaseDate: "",
    trailerUrl: "",
    cast: "",
    posterImage: "",
    movieImages: "",
  });

  const resetForm = () =>
    setFormData({
      title: "",
      description: "",
      duration: "",
      genre: "",
      releaseDate: "",
      trailerUrl: "",
      cast: "",
      posterImage: "",
      movieImages: "",
    });

  return { formData, setFormData, resetForm };
}

// ========================================================
//  Main Component: MovieAdminPage
// ========================================================
export default function MovieAdminPage() {
  const { data: movies = [], isLoading } = useGetMovies();
  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie();
  const deleteMovie = useDeleteMovie();
  const { toast } = useToast();

  // State for Edit/Create Dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editMovie, setEditMovie] = useState<any>(null); // Movie object being edited
  const { formData, setFormData, resetForm } = useMovieForm();

  // State for View Details Dialog
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null); // Movie object for viewing

  // Helper to format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  //  Open Dialog for Edit
  const handleOpenEditDialog = (movie?: any) => {
    if (movie) {
      setEditMovie(movie);
      setFormData({
        title: movie.title || "",
        description: movie.description || "",
        duration: movie.duration || "",
        genre: movie.genre || "",
        releaseDate: movie.releaseDate ? movie.releaseDate.substring(0, 10) : "", // Format date to YYYY-MM-DD for input field
        trailerUrl: movie.trailerUrl || "",
        // Convert array/other format to string for form simplicity
        cast: Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast || "",
        posterImage: movie.posterImage || "",
        movieImages: Array.isArray(movie.movieImages) ? movie.movieImages.join(", ") : movie.movieImages || "",
      });
    } else {
      setEditMovie(null);
      resetForm();
    }
    setEditOpen(true);
  };

  // Open Dialog for View Details
  const handleViewDetails = (movie: any) => {
    setSelectedMovie(movie);
    setDetailsOpen(true);
  };

  //  Delete
  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    deleteMovie.mutate(id, {
      onSuccess: () => toast({ title: "Deleted successfully" }),
    });
  };

  // ✅ Save or Update Movie
  const handleSave = () => {
    if (!formData.title || !formData.releaseDate || !formData.duration || !formData.genre) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill all required fields (Title, Genre, Date, Duration).",
      });
      return;
    }

    // Convert string fields back to array/number for API payload
    const payload = {
      title: formData.title,
      description: formData.description,
      duration: Number(formData.duration),
      genre: formData.genre,
      releaseDate: new Date(formData.releaseDate).toISOString(), // Convert YYYY-MM-DD back to ISO string
      trailerUrl: formData.trailerUrl,
      cast: formData.cast.split(",").map(s => s.trim()).filter(s => s),
      posterImage: formData.posterImage,
      movieImages: formData.movieImages.split(",").map(s => s.trim()).filter(s => s),
    };

    if (editMovie) {
      updateMovie.mutate(
        { id: editMovie._id, data: payload },
        {
          onSuccess: () => {
            setEditOpen(false);
            setEditMovie(null);
            toast({ title: "Updated successfully" });
          },
        }
      );
    } else {
      createMovie.mutate(payload, {
        onSuccess: () => {
          setEditOpen(false);
          toast({ title: "Movie created successfully" });
        },
      });
    }
  };

  const isPending = createMovie.isPending || updateMovie.isPending;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Movies</h1>
        <Button onClick={() => handleOpenEditDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Add Movie
        </Button>
      </div>

      {/* 🎬 Movie Table - ENHANCED DETAILS */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : movies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No movies found.
                </TableCell>
              </TableRow>
            ) : (
              movies.map((movie: any) => (
                <TableRow key={movie._id}>
                  <TableCell className="font-medium">{movie.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{movie.genre}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(movie.releaseDate)}</TableCell>
                  <TableCell>{movie.duration} mins</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(movie)}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditDialog(movie)}
                      title="Edit Movie"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(movie._id)}
                      title="Delete Movie"
                      disabled={deleteMovie.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🪟 Edit/Create Movie Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMovie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
            <DialogDescription>
              {editMovie ? `Updating details for ${editMovie.title}.` : "Enter the details for the new movie."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="releaseDate">Release Date</Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cast">Cast (Comma-separated names)</Label>
              <Input
                id="cast"
                value={formData.cast}
                onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailerUrl">Trailer URL</Label>
              <Input
                id="trailerUrl"
                value={formData.trailerUrl}
                onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="posterImage">Poster Image URL</Label>
              <Input
                id="posterImage"
                value={formData.posterImage}
                onChange={(e) => setFormData({ ...formData, posterImage: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="movieImages">Movie Images URL (Comma-separated)</Label>
              <Input
                id="movieImages"
                value={formData.movieImages}
                onChange={(e) => setFormData({ ...formData, movieImages: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : editMovie ? (
                "Save Changes"
              ) : (
                "Create Movie"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ℹ️ View Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMovie?.title} Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            {selectedMovie && (
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                    <p className="font-semibold">ID:</p>
                    <p className="text-muted-foreground">{selectedMovie._id}</p>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <p className="font-semibold">Genre:</p>
                    <Badge variant="secondary">{selectedMovie.genre}</Badge>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <p className="font-semibold">Release Date:</p>
                    <p>{formatDate(selectedMovie.releaseDate)}</p>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <p className="font-semibold">Duration:</p>
                    <p>{selectedMovie.duration} minutes</p>
                </div>
                <div className="space-y-1 border-b pb-2">
                    <p className="font-semibold">Description:</p>
                    <p className="text-muted-foreground text-justify">{selectedMovie.description}</p>
                </div>
                <div className="space-y-1 border-b pb-2">
                    <p className="font-semibold">Cast:</p>
                    <div className="flex flex-wrap gap-2">
                        {Array.isArray(selectedMovie.cast) && selectedMovie.cast.map((actor: string) => (
                            <Badge key={actor} variant="outline">{actor}</Badge>
                        ))}
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="font-semibold">Trailer:</p>
                    <p className="text-blue-500 truncate"><a href={selectedMovie.trailerUrl} target="_blank" rel="noopener noreferrer">{selectedMovie.trailerUrl}</a></p>
                </div>
                <div className="space-y-1">
                    <p className="font-semibold">Poster Image:</p>
                    <p className="text-blue-500 truncate"><a href={selectedMovie.posterImage} target="_blank" rel="noopener noreferrer">{selectedMovie.posterImage}</a></p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createBooks, getGenre } from "@/services/book";

interface BookFormData {
  title: string;
  author: string;
  genres: string | string[];
  description?: string;
  cover_image?: string;
  isbn?: string;
  publication_date?: string;
}

interface AddBookModalProps {
  onSubmit: (bookData: BookFormData) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Genre interface to type the genre data
interface Genre {
  id: number;
  name: string;
}

export default function AddBookModal({
  onSubmit,
  open,
  setOpen,
}: AddBookModalProps) {
  const [genres, setGenres] = useState<Genre[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    author: '',
    genres: '',
    description: "",
    cover_image: "", // Changed to string for URL
    isbn: "",
    publication_date: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      author: '',
      genres: '',
      description: "",
      cover_image: "", // Reset to empty string
      isbn: "",
      publication_date: "",
    });
  };

  useEffect(() => { 
    try {
      getGenre({}).then((result) => { 
        setGenres(result.objects);
      });
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenreChange = (value: string) => {
    setFormData({
      ...formData,
      genres: value,
    });
  };

  const handleFormSubmit = () => {
    const parsedData: BookFormData = {
      ...formData,
      genres: formData.genres ? [formData.genres] : [],
    };

    const result = createBooks(parsedData)

    console.log("Submitting from modal:", parsedData, result);
    onSubmit(parsedData);
    // setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md max-h-[90vh] bg-white text-black overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a New Book</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              name="title"
              value={formData.title}
              placeholder="Enter title"
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="author">Author</Label>
            <Input
              name="author"
              value={formData.author}
              placeholder="Enter author"
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="genres">Select Genre</Label>
            <Select name="genres" value={formData.genres.toString()} onValueChange={handleGenreChange}>
              <SelectTrigger className="w-full border border-slate-800">
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {genres && genres?.map((genre) => (
                  <SelectItem key={genre.id} value={genre?.id.toString()}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              required
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="border border-slate-800"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input name="isbn" value={formData.isbn} placeholder="Enter ISBN" onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="publication_date">Publication Date</Label>
            <Input
              required
              type="date"
              name="publication_date"
              value={formData.publication_date}
              onChange={handleChange}
            />
          </div>

          {/* Cover image URL input */}
          <div className="grid gap-2">
            <Label htmlFor="cover_image">Cover Image URL</Label>
            <Input
              name="cover_image"
              value={formData.cover_image}
              placeholder="Enter image URL"
              onChange={handleChange}
            />
            {formData.cover_image && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Preview:</p>
                <img
                  src={formData.cover_image}
                  alt="Cover preview"
                  className="mt-1 w-32 h-32 object-cover rounded-md border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-image.jpg"; // Replace with your placeholder image path
                    target.alt = "Image URL error";
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleFormSubmit}
            className="bg-slate-800 text-white hover:bg-slate-700"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
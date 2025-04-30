// 1. Update the imports to include Select component
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
import Image from "next/image";
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
  cover_image?: File | string;
  isbn?: string;
  publication_date?: string;
}

interface AddBookModalProps {
  onSubmit: (bookData: BookFormData) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

// 3. Add a Genre interface to type the genre data
interface Genre {
  id: number;
  name: string;
}

export default function AddBookModal({
  onSubmit,
  open,
  setOpen,
}: AddBookModalProps) {
  // 4. Update the genre state to be properly typed
  const [genres, setGenres] = useState<Genre[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    author: '',
    genres: '',
    description: "",
    cover_image: null as File | null,
    isbn: "",
    publication_date: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      author: '',
      genres: '',
      description: "",
      cover_image: null,
      isbn: "",
      publication_date: "",
    });
  };

  useEffect(() => { 
    try {
      getGenre({}).then((result) => { 
        setGenres(result.objects);
        console.log(result.objects, 'genres')
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

  // 5. Add a handler for the genre select change
  const handleGenreChange = (value: string) => {
    setFormData({
      ...formData,
      genres: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        cover_image: file,
      });
    }
  };

  const handleFormSubmit = () => {
    const parsedData: BookFormData = {
      ...formData,
      genres: formData.genres ? [formData.genres] : [],
    };

    const result = createBooks(parsedData)

    console.log("Submitting from modal:", parsedData, result);
    onSubmit(parsedData);
    setOpen(false); // Triggers useEffect to reset form
  };

  // 6. Replace the genres input with a select dropdown in the JSX
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md max-h-[90vh] bg-white text-black overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a New Book</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Other form fields remain the same */}
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
              type="date"
              name="publication_date"
              value={formData.publication_date}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Cover image section remains the same */}
        <div className="grid gap-2">
          <Label htmlFor="cover_image">Cover Image</Label>

          <div>
            <label
              htmlFor="cover_image"
              className="cursor-pointer inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 rounded-md border border-slate-800"
            >
              Choose Image
            </label>
            <input
              id="cover_image"
              name="cover_image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {formData.cover_image && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Preview:</p>
              <Image
                src={URL.createObjectURL(formData.cover_image)}
                alt="Preview"
                className="mt-1 w-32 h-32 object-cover rounded-md border"
                width={30}
                height={30}
              />
            </div>
          )}
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
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface BookFormData {
  title: string;
  authors: string[];
  genres: string[];
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

export default function AddBookModal({
  onSubmit,
  open,
  setOpen,
}: AddBookModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    genres: "",
    description: "",
    cover_image: null as File | null,
    isbn: "",
    publication_date: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      authors: "",
      genres: "",
      description: "",
      cover_image: null,
      isbn: "",
      publication_date: "",
    });
  };

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
      authors: formData.authors.split(",").map((a) => a.trim()),
      genres: formData.genres.split(",").map((g) => g.trim()),
    };

    console.log("Submitting from modal:", parsedData);
    onSubmit(parsedData);
    setOpen(false); // Triggers useEffect to reset form
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a New Book</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="authors">Author(s)</Label>
            <Input
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              placeholder="Separate names with commas"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="genres">Genre(s)</Label>
            <Input
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              placeholder="Separate genres with commas"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input name="isbn" value={formData.isbn} onChange={handleChange} />
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

        <div className="grid gap-2">
          <Label htmlFor="cover_image">Cover Image</Label>

          <div>
            <label
              htmlFor="cover_image"
              className="cursor-pointer inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 rounded-md border border-gray-300"
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
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

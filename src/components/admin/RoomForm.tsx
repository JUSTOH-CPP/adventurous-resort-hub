
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Room } from '@/types/supabase';

interface RoomFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (room: Omit<Room, 'id' | 'created_at' | 'updated_at'>) => void;
  initialData?: Room | null;
  loading?: boolean;
}

const RoomForm: React.FC<RoomFormProps> = ({ open, onOpenChange, onSubmit, initialData, loading }) => {
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [price, setPrice] = useState(initialData?.price?.toString() ?? '');
  const [capacity, setCapacity] = useState(initialData?.capacity?.toString() ?? '1');
  const [imageUrl, setImageUrl] = useState(initialData?.images?.[0] ?? '');

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description ?? '');
      setPrice(initialData.price.toString());
      setCapacity(initialData.capacity.toString());
      setImageUrl(initialData.images?.[0] ?? '');
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCapacity('1');
      setImageUrl('');
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      price: parseFloat(price) || 0,
      capacity: parseInt(capacity) || 1,
      images: imageUrl ? [imageUrl] : [],
      amenities: null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Room' : 'Add New Room'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-name">Name</Label>
            <Input id="room-name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room-desc">Description</Label>
            <Textarea id="room-desc" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="room-price">Price per night</Label>
              <Input id="room-price" type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room-capacity">Capacity</Label>
              <Input id="room-capacity" type="number" min="1" value={capacity} onChange={e => setCapacity(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="room-image">Image URL</Label>
            <Input id="room-image" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update Room' : 'Create Room'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomForm;

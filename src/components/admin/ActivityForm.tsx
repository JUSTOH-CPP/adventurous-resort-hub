
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Activity } from '@/types/supabase';

interface ActivityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) => void;
  initialData?: Activity | null;
  loading?: boolean;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ open, onOpenChange, onSubmit, initialData, loading }) => {
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [price, setPrice] = useState(initialData?.price?.toString() ?? '');
  const [duration, setDuration] = useState(initialData?.duration?.toString() ?? '60');
  const [maxParticipants, setMaxParticipants] = useState(initialData?.max_participants?.toString() ?? '');
  const [category, setCategory] = useState(initialData?.category ?? '');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty ?? '');
  const [imageUrl, setImageUrl] = useState(initialData?.image ?? '');
  const [groupSize, setGroupSize] = useState(initialData?.groupSize ?? '');

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description ?? '');
      setPrice(initialData.price.toString());
      setDuration(initialData.duration.toString());
      setMaxParticipants(initialData.max_participants?.toString() ?? '');
      setCategory(initialData.category ?? '');
      setDifficulty(initialData.difficulty ?? '');
      setImageUrl(initialData.image ?? '');
      setGroupSize(initialData.groupSize ?? '');
    } else {
      setName(''); setDescription(''); setPrice(''); setDuration('60');
      setMaxParticipants(''); setCategory(''); setDifficulty('');
      setImageUrl(''); setGroupSize('');
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      price: parseFloat(price) || 0,
      duration: parseInt(duration) || 60,
      max_participants: maxParticipants ? parseInt(maxParticipants) : null,
      category: category || null,
      difficulty: difficulty || null,
      image: imageUrl || null,
      groupSize: groupSize || null,
      rating: initialData?.rating ?? null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="act-name">Name</Label>
            <Input id="act-name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="act-desc">Description</Label>
            <Textarea id="act-desc" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="act-price">Price</Label>
              <Input id="act-price" type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="act-duration">Duration (min)</Label>
              <Input id="act-duration" type="number" min="1" value={duration} onChange={e => setDuration(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="act-max">Max Participants</Label>
              <Input id="act-max" type="number" min="1" value={maxParticipants} onChange={e => setMaxParticipants(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="act-group">Group Size</Label>
              <Input id="act-group" value={groupSize} onChange={e => setGroupSize(e.target.value)} placeholder="e.g. 4-8 people" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="safari">Safari</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="wildlife">Wildlife</SelectItem>
                  <SelectItem value="conservation">Conservation</SelectItem>
                  <SelectItem value="air">Aerial</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Challenging">Challenging</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="act-image">Image URL</Label>
            <Input id="act-image" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update Activity' : 'Create Activity'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityForm;

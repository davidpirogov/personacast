'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

interface ApiClient {
  id: string;
  name: string;
  description: string;
}

export default function EditApiClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('id');

  const [formData, setFormData] = useState<ApiClient>({
    id: '',
    name: '',
    description: '',
  });

  useEffect(() => {
    const fetchClient = async () => {
      if (!clientId) {
        router.push('/admin/api-clients');
        return;
      }

      // TODO: Implement fetch API call
      // For now, using mock data
      setFormData({
        id: clientId,
        name: 'Sample Client',
        description: 'Sample Description',
      });
    };

    fetchClient();
  }, [clientId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update API call
    router.push('/admin/api-clients');
  };

  if (!clientId) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit API Client</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/api-clients')}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 
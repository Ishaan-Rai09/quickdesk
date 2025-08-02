'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SeedPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const seedDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({ success: false, error: 'Failed to seed database' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">Database Seeding</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-gray-600">
            Click the button below to populate the database with default users and data.
          </p>
          
          <Button 
            onClick={seedDatabase} 
            disabled={loading}
            size="lg"
            className="mb-6"
          >
            {loading ? 'Seeding Database...' : 'Seed Database'}
          </Button>

          {results && (
            <div className="mt-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Seeding Results:</h3>
              <pre className="text-sm text-left bg-gray-100 p-3 rounded">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600">
            <h4 className="font-semibold mb-2">Default Credentials:</h4>
            <div className="space-y-1">
              <p><strong>Admin:</strong> admin@quickdesk.com / Admin@123456</p>
              <p><strong>Agent:</strong> agent@quickdesk.com / Agent@123456</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

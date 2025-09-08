import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { Navigate } from 'react-router-dom';
import { Database } from '@/integrations/supabase/types';

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeSubscriptions: 0,
    totalSubscriptions: 0,
    totalProducts: 0,
    totalCatalogs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [wiping, setWiping] = useState<'storage' | 'all' | null>(null);

  const isAdmin = useMemo(() => !!user?.email, [user?.email]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase.rpc('admin_counts');
        if (error) throw error;
        setStats({
          activeSubscriptions: data?.active_subscriptions || 0,
          totalSubscriptions: data?.total_subscriptions || 0,
          totalProducts: data?.total_products || 0,
          totalCatalogs: data?.total_catalogs || 0,
        });
      } catch (e) {
        console.error('Admin stats error:', e);
        toast.error('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const callWipe = async (scope: 'storage' | 'all') => {
    if (!token) {
      toast.error('Enter ADMIN_TOKEN to proceed');
      return;
    }
    if (!confirm(`This will wipe ${scope === 'all' ? 'storage and database (tables)' : 'storage'}.
Use only in testing. Continue?`)) return;
    setWiping(scope);
    try {
      const res = await fetch('/api/admin-wipe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirm: true, scope }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Wipe failed');
      toast.success('Wipe completed');
    } catch (e: any) {
      console.error('Wipe error:', e);
      toast.error(e.message || 'Wipe failed');
    } finally {
      setWiping(null);
    }
  };

  // Wait for auth to hydrate; route guard already checks auth in App.tsx
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Internal testing and system overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="text-sm text-muted-foreground">Active Subscriptions</div>
            <div className="text-3xl font-semibold">{loading ? '—' : stats.activeSubscriptions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="text-sm text-muted-foreground">Total Subscriptions</div>
            <div className="text-3xl font-semibold">{loading ? '—' : stats.totalSubscriptions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="text-sm text-muted-foreground">Total Images</div>
            <div className="text-3xl font-semibold">{loading ? '—' : stats.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-2">
            <div className="text-sm text-muted-foreground">Total Catalogs</div>
            <div className="text-3xl font-semibold">{loading ? '—' : stats.totalCatalogs}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Danger Zone</h2>
              <p className="text-sm text-muted-foreground">Use only in a testing environment</p>
            </div>
            <Badge variant="destructive">Admin</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input placeholder="ADMIN_TOKEN" value={token} onChange={(e) => setToken(e.target.value)} />
            <Button variant="destructive" onClick={() => callWipe('storage')} disabled={wiping!==null}>
              {wiping==='storage' ? 'Purging Storage…' : 'Purge Storage (R2)'}
            </Button>
            <Button variant="destructive" onClick={() => callWipe('all')} disabled={wiping!==null}>
              {wiping==='all' ? 'Purging All…' : 'Purge Storage + DB (manual SQL)'}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            DB wipe requires running <code>scripts/wipe-db.sql</code> in Supabase SQL editor.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

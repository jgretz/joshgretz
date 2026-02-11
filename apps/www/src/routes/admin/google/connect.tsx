import {createFileRoute} from '@tanstack/react-router';
import {useCallback, useEffect, useState} from 'react';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {Button} from '../../../components/ui/button';
import {title} from '../../../config.shared';
import {getThirdPartyAccess} from '../../../services/auth/auth-server';
import {
  getGoogleSheetsAuthUrl,
  saveSpreadsheetId,
} from '../../../services/google-sheets/google-sheets-server';
import {requireAuth} from '../../../services/auth/requireAuth';

export const Route = createFileRoute('/admin/google/connect')({
  component: GoogleConnect,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Connect Google')}],
  }),
});

function GoogleConnect() {
  const {user} = Route.useRouteContext();
  const [isConnected, setIsConnected] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      if (!user) return;

      try {
        const access = await getThirdPartyAccess({data: {userId: user.id}});
        setIsConnected(!!access?.google_access_token);
        if (access?.google_spreadsheet_id) {
          setSpreadsheetId(access.google_spreadsheet_id);
        }
      } catch {
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, [user]);

  const handleConnect = useCallback(async () => {
    const redirectUri = `${window.location.origin}/admin/google/callback`;

    try {
      const authUrl = await getGoogleSheetsAuthUrl({data: {redirectUri}});
      window.location.href = authUrl;
    } catch (err) {
      console.error('Failed to get Google auth URL:', err);
    }
  }, []);

  const handleSaveSpreadsheet = useCallback(async () => {
    if (!user || !spreadsheetId.trim()) return;

    setSaving(true);
    setSaveSuccess(false);

    try {
      await saveSpreadsheetId({
        data: {userId: user.id, spreadsheetId: spreadsheetId.trim()},
      });
      setSaveSuccess(true);
    } catch (err) {
      console.error('Failed to save spreadsheet ID:', err);
    } finally {
      setSaving(false);
    }
  }, [user, spreadsheetId]);

  const buttonText = isConnected ? 'Reconnect to Google' : 'Connect to Google';

  return (
    <AdminLayout title="Connect to Google">
      <div className="space-y-6">
        <div className="rounded-lg border border-warm-200 bg-white p-8">
          {loading ? (
            <p className="text-center text-warm-600">Loading...</p>
          ) : (
            <div className="text-center">
              {isConnected && (
                <p className="mb-6 text-green-600">Your Google account is connected</p>
              )}
              <Button onClick={handleConnect}>{buttonText}</Button>
            </div>
          )}
        </div>

        {isConnected && (
          <div className="rounded-lg border border-warm-200 bg-white p-8">
            <h2 className="mb-4 font-serif text-xl text-warm-800">Spreadsheet ID</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={spreadsheetId}
                onChange={(e) => {
                  setSpreadsheetId(e.target.value);
                  setSaveSuccess(false);
                }}
                placeholder="Enter Google Spreadsheet ID"
                className="flex-1 rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
              />
              <Button onClick={handleSaveSpreadsheet} disabled={saving || !spreadsheetId.trim()}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
            {saveSuccess && <p className="mt-2 text-green-600">Spreadsheet ID saved</p>}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

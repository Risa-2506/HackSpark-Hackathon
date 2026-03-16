import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Bell, Shield, Database, Mail, Lock, User } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure system preferences and security settings
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Profile Settings</CardTitle>
            </div>
            <CardDescription>Manage your admin account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Government Official" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="admin@ration.gov.in" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" defaultValue="Public Distribution System" />
            </div>
            <Button>Update Profile</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage security and authentication settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Enable 2FA for additional security</p>
              </div>
              <Switch />
            </div>
            <Button>Change Password</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure alert and notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Fraud Detection Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when fraud is detected</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Summary Report</Label>
                <p className="text-sm text-muted-foreground">Receive daily transaction summaries</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High-Risk Transaction Alerts</Label>
                <p className="text-sm text-muted-foreground">Instant alerts for suspicious activities</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications to email</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Fraud Detection Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Fraud Detection Parameters</CardTitle>
            </div>
            <CardDescription>Configure thresholds for fraud detection algorithms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="complaint-threshold">Complaint Ratio Threshold</Label>
              <Input id="complaint-threshold" type="number" step="0.1" defaultValue="0.3" />
              <p className="text-sm text-muted-foreground">Flag shops with complaint ratio above this value</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="black-market-threshold">Black Market Threshold (kg)</Label>
              <Input id="black-market-threshold" type="number" defaultValue="5" />
              <p className="text-sm text-muted-foreground">Flag when black market volume exceeds this amount</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="min-complaints">Minimum Complaints for RED Status</Label>
              <Input id="min-complaints" type="number" defaultValue="2" />
              <p className="text-sm text-muted-foreground">Number of complaints to trigger RED status</p>
            </div>
            <Button>Save Detection Settings</Button>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>Data Management</CardTitle>
            </div>
            <CardDescription>Manage data sync and backup settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Sync to MongoDB</Label>
                <p className="text-sm text-muted-foreground">Automatically sync local data to cloud</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Backup</Label>
                <p className="text-sm text-muted-foreground">Create daily database backups</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Last Sync</Label>
              <p className="text-sm text-muted-foreground">
                Last synced: February 20, 2026 at 4:30 PM
              </p>
              <Button variant="outline">Sync Now</Button>
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <CardTitle>API Configuration</CardTitle>
            </div>
            <CardDescription>Manage API endpoints and credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="api-endpoint">API Endpoint URL</Label>
              <Input 
                id="api-endpoint" 
                defaultValue="https://kenspeckle-norah-guiltily.ngrok-free.dev/api/v1" 
                readOnly 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" type="password" defaultValue="••••••••••••••••" />
            </div>
            <Button variant="outline">Test Connection</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

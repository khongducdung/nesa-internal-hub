import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Clock } from 'lucide-react';

interface WorkSession {
  name: string;
  start_time: string;
  end_time: string;
}

interface WorkSessionsManagerProps {
  sessions: WorkSession[];
  onChange: (sessions: WorkSession[]) => void;
  title: string;
  maxSessions?: number;
}

export function WorkSessionsManager({ sessions, onChange, title, maxSessions = 4 }: WorkSessionsManagerProps) {
  const [newSession, setNewSession] = useState<WorkSession>({
    name: '',
    start_time: '08:00',
    end_time: '12:00'
  });

  const addSession = () => {
    if (sessions.length >= maxSessions) return;
    if (!newSession.name.trim()) return;
    
    const updatedSessions = [...sessions, { ...newSession }];
    onChange(updatedSessions);
    setNewSession({
      name: '',
      start_time: '08:00',
      end_time: '12:00'
    });
  };

  const removeSession = (index: number) => {
    const updatedSessions = sessions.filter((_, i) => i !== index);
    onChange(updatedSessions);
  };

  const updateSession = (index: number, field: keyof WorkSession, value: string) => {
    const updatedSessions = sessions.map((session, i) => 
      i === index ? { ...session, [field]: value } : session
    );
    onChange(updatedSessions);
  };

  const calculateSessionDuration = (session: WorkSession) => {
    const start = new Date(`2000-01-01T${session.start_time}:00`);
    const end = new Date(`2000-01-01T${session.end_time}:00`);
    let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (diff < 0) diff += 24;
    return diff;
  };

  const totalHours = sessions.reduce((total, session) => total + calculateSessionDuration(session), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {title}
          </div>
          <Badge variant="outline">
            Tổng: {totalHours.toFixed(1)} giờ
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Sessions */}
        {sessions.map((session, index) => (
          <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
            <div className="flex-1 grid grid-cols-3 gap-2">
              <Input
                placeholder="Tên ca"
                value={session.name}
                onChange={(e) => updateSession(index, 'name', e.target.value)}
              />
              <Input
                type="time"
                value={session.start_time}
                onChange={(e) => updateSession(index, 'start_time', e.target.value)}
              />
              <Input
                type="time"
                value={session.end_time}
                onChange={(e) => updateSession(index, 'end_time', e.target.value)}
              />
            </div>
            <Badge variant="secondary" className="min-w-[60px] text-center">
              {calculateSessionDuration(session).toFixed(1)}h
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSession(index)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {/* Add New Session */}
        {sessions.length < maxSessions && (
          <div className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg">
            <div className="flex-1 grid grid-cols-3 gap-2">
              <Input
                placeholder="Tên ca mới"
                value={newSession.name}
                onChange={(e) => setNewSession(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="time"
                value={newSession.start_time}
                onChange={(e) => setNewSession(prev => ({ ...prev, start_time: e.target.value }))}
              />
              <Input
                type="time"
                value={newSession.end_time}
                onChange={(e) => setNewSession(prev => ({ ...prev, end_time: e.target.value }))}
              />
            </div>
            <Button onClick={addSession} size="icon" disabled={!newSession.name.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {sessions.length >= maxSessions && (
          <p className="text-sm text-gray-500 text-center">
            Tối đa {maxSessions} ca trong một ngày
          </p>
        )}
      </CardContent>
    </Card>
  );
}

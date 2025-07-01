import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, Clock, AlertCircle } from 'lucide-react';

interface WorkSession {
  name: string;
  start_time: string;
  end_time: string;
  [key: string]: any;
}

interface WorkSessionsManagerProps {
  sessions: WorkSession[];
  onChange: (sessions: WorkSession[]) => void;
  title: string;
  maxSessions?: number;
}

export function WorkSessionsManager({ 
  sessions, 
  onChange, 
  title, 
  maxSessions = 4 
}: WorkSessionsManagerProps) {
  const [newSession, setNewSession] = useState<WorkSession>({
    name: '',
    start_time: '08:00',
    end_time: '12:00'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateSession = (session: WorkSession, index?: number): string | null => {
    if (!session.name.trim()) {
      return 'Tên ca không được để trống';
    }

    if (session.start_time >= session.end_time) {
      return 'Thời gian kết thúc phải sau thời gian bắt đầu';
    }

    // Check for overlapping sessions
    const otherSessions = index !== undefined 
      ? sessions.filter((_, i) => i !== index)
      : sessions;

    for (const otherSession of otherSessions) {
      const currentStart = new Date(`2000-01-01T${session.start_time}:00`);
      const currentEnd = new Date(`2000-01-01T${session.end_time}:00`);
      const otherStart = new Date(`2000-01-01T${otherSession.start_time}:00`);
      const otherEnd = new Date(`2000-01-01T${otherSession.end_time}:00`);

      if (
        (currentStart >= otherStart && currentStart < otherEnd) ||
        (currentEnd > otherStart && currentEnd <= otherEnd) ||
        (currentStart <= otherStart && currentEnd >= otherEnd)
      ) {
        return `Thời gian trùng với ca "${otherSession.name}"`;
      }
    }

    return null;
  };

  const addSession = () => {
    if (sessions.length >= maxSessions) return;
    
    const error = validateSession(newSession);
    if (error) {
      setErrors({ new: error });
      return;
    }
    
    const updatedSessions = [...sessions, { ...newSession }];
    onChange(updatedSessions);
    setNewSession({
      name: '',
      start_time: '08:00',
      end_time: '12:00'
    });
    setErrors({});
  };

  const removeSession = (index: number) => {
    const updatedSessions = sessions.filter((_, i) => i !== index);
    onChange(updatedSessions);
    
    // Clear any errors for removed session
    const newErrors = { ...errors };
    delete newErrors[`session_${index}`];
    setErrors(newErrors);
  };

  const updateSession = (index: number, field: keyof WorkSession, value: string) => {
    const updatedSessions = sessions.map((session, i) => 
      i === index ? { ...session, [field]: value } : session
    );
    
    // Validate the updated session
    const error = validateSession(updatedSessions[index], index);
    const newErrors = { ...errors };
    if (error) {
      newErrors[`session_${index}`] = error;
    } else {
      delete newErrors[`session_${index}`];
    }
    setErrors(newErrors);
    
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

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {title}
          </div>
          <Badge variant="outline" className={totalHours > 0 ? 'bg-green-50 text-green-700' : ''}>
            Tổng: {totalHours.toFixed(1)} giờ
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Alert */}
        {hasErrors && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Vui lòng kiểm tra lại thông tin các ca làm việc
            </AlertDescription>
          </Alert>
        )}

        {/* Existing Sessions */}
        {sessions.map((session, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-white">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div>
                  <Input
                    placeholder="Tên ca"
                    value={session.name}
                    onChange={(e) => updateSession(index, 'name', e.target.value)}
                    className={errors[`session_${index}`] ? 'border-red-500' : ''}
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    value={session.start_time}
                    onChange={(e) => updateSession(index, 'start_time', e.target.value)}
                    className={errors[`session_${index}`] ? 'border-red-500' : ''}
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    value={session.end_time}
                    onChange={(e) => updateSession(index, 'end_time', e.target.value)}
                    className={errors[`session_${index}`] ? 'border-red-500' : ''}
                  />
                </div>
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
            
            {errors[`session_${index}`] && (
              <p className="text-sm text-red-500 px-3">{errors[`session_${index}`]}</p>
            )}
          </div>
        ))}

        {/* Add New Session */}
        {sessions.length < maxSessions && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg bg-gray-50">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div>
                  <Input
                    placeholder="Tên ca mới"
                    value={newSession.name}
                    onChange={(e) => setNewSession(prev => ({ ...prev, name: e.target.value }))}
                    className={errors.new ? 'border-red-500' : ''}
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    value={newSession.start_time}
                    onChange={(e) => setNewSession(prev => ({ ...prev, start_time: e.target.value }))}
                    className={errors.new ? 'border-red-500' : ''}
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    value={newSession.end_time}
                    onChange={(e) => setNewSession(prev => ({ ...prev, end_time: e.target.value }))}
                    className={errors.new ? 'border-red-500' : ''}
                  />
                </div>
              </div>
              <Button 
                onClick={addSession} 
                size="icon" 
                disabled={!newSession.name.trim()}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {errors.new && (
              <p className="text-sm text-red-500 px-3">{errors.new}</p>
            )}
          </div>
        )}

        {/* Max Sessions Warning */}
        {sessions.length >= maxSessions && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Tối đa {maxSessions} ca trong một ngày. Xóa ca hiện có để thêm ca mới.
            </AlertDescription>
          </Alert>
        )}

        {/* Helper Text */}
        {sessions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Chưa có ca làm việc nào</p>
            <p className="text-xs">Thêm ít nhất một ca để tiếp tục</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

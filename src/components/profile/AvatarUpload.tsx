
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, Upload, Crop, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AvatarUploadProps {
  employeeId?: string;
  currentAvatarUrl?: string;
  fullName?: string;
  onAvatarUpdated: (url: string) => void;
}

export function AvatarUpload({ employeeId, currentAvatarUrl, fullName, onAvatarUpdated }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const compressImage = (file: File, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Set canvas size for square crop (256x256 for optimal avatar size)
        const size = 256;
        canvas.width = size;
        canvas.height = size;

        // Calculate crop dimensions to maintain aspect ratio
        const minDimension = Math.min(img.width, img.height);
        const sourceX = (img.width - minDimension) / 2;
        const sourceY = (img.height - minDimension) / 2;

        // Draw and crop the image
        ctx.drawImage(
          img,
          sourceX, sourceY, minDimension, minDimension, // Source crop
          0, 0, size, size // Destination size
        );

        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn file ảnh hợp lệ',
        variant: 'destructive',
      });
      return;
    }

    // Check file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Lỗi',
        description: 'File không được vượt quá 10MB',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
      setDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropAndCompress = async () => {
    if (!selectedFile) return;

    try {
      // Compress and crop the image
      const compressedBlob = await compressImage(selectedFile, 0.85);
      setCroppedImageBlob(compressedBlob);

      // Show compressed size info
      const originalSizeMB = (selectedFile.size / 1024 / 1024).toFixed(2);
      const compressedSizeMB = (compressedBlob.size / 1024 / 1024).toFixed(2);
      
      toast({
        title: 'Ảnh đã được nén',
        description: `Kích thước: ${originalSizeMB}MB → ${compressedSizeMB}MB`,
      });

    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xử lý ảnh',
        variant: 'destructive',
      });
    }
  };

  const handleUpload = async () => {
    if (!croppedImageBlob && !selectedFile) return;

    // Check if employeeId is available
    if (!employeeId) {
      toast({
        title: 'Lỗi',
        description: 'Không tìm thấy thông tin nhân viên. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Use compressed blob if available, otherwise compress the original file
      const fileToUpload = croppedImageBlob || await compressImage(selectedFile!);
      
      const fileExt = 'jpg'; // Always save as JPEG for better compression
      const fileName = `${employeeId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Delete old avatar if exists
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('employee-files')
            .remove([`avatars/${oldPath}`]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('employee-files')
        .upload(filePath, fileToUpload, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('employee-files')
        .getPublicUrl(filePath);

      // Update employee record
      const { error: updateError } = await supabase
        .from('employees')
        .update({ avatar_url: publicUrl })
        .eq('id', employeeId);

      if (updateError) throw updateError;

      // Call callback to update parent component
      onAvatarUpdated(publicUrl);
      
      // Reset states and close dialog
      setDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl('');
      setCroppedImageBlob(null);

      toast({
        title: 'Thành công',
        description: 'Cập nhật ảnh đại diện thành công',
      });

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tải ảnh lên',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setCroppedImageBlob(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="relative">
        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
          <AvatarImage src={currentAvatarUrl} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-semibold">
            {fullName?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <Button
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0 bg-white text-gray-600 hover:bg-gray-50 shadow-lg border-2 border-white"
          variant="outline"
          title="Cập nhật ảnh đại diện"
        >
          <Camera className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Cập nhật ảnh đại diện</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {previewUrl && (
              <div className="flex justify-center">
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="h-48 w-48 object-cover rounded-full border-4 border-gray-100"
                  />
                  {croppedImageBlob && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full p-1">
                      <Crop className="h-3 w-3" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Ảnh sẽ được tự động cắt thành hình vuông và nén để tối ưu dung lượng
              </p>
              {selectedFile && (
                <p className="text-xs text-gray-500">
                  Kích thước gốc: {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
                </p>
              )}
            </div>

            <div className="flex justify-center gap-2">
              {!croppedImageBlob && selectedFile && (
                <Button
                  onClick={handleCropAndCompress}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Crop className="h-4 w-4" />
                  Cắt & Nén ảnh
                </Button>
              )}
              
              <Button
                onClick={resetSelection}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Chọn lại
              </Button>

              <Button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile || !employeeId}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Đang tải...' : 'Cập nhật'}
              </Button>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const { signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Lỗi đăng nhập",
        description: error.message === 'Invalid login credentials' 
          ? "Email hoặc mật khẩu không chính xác"
          : error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn đến với NESA!"
      });
    }
    
    setIsLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "NESA Groups - cấp lại mật khẩu",
        description: "Em ơi, não cá vàng quá, sau nhớ đổi mật khẩu giống như mật khẩu tài khoản ngân hàng đó nhé. Đây là mật khẩu của em để đăng nhập vào hệ thống.",
      });
      setShowResetForm(false);
      setResetEmail('');
    }

    setIsResetLoading(false);
  };

  if (showResetForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white backdrop-blur-sm">
            <CardHeader className="text-center space-y-6 pb-8">
              <div className="flex justify-center mb-6">
                <img 
                  src="/lovable-uploads/ebcd3d17-d92b-4d28-90a3-1cec952be13a.png" 
                  alt="NESA Logo" 
                  className="h-16 w-auto"
                />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                  Đặt lại mật khẩu
                </CardTitle>
                <p className="text-gray-600">Nhập email để yêu cầu đặt lại mật khẩu</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handlePasswordReset} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm font-medium text-gray-700">
                    Địa chỉ email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Nhập email của bạn"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                    disabled={isResetLoading}
                  >
                    {isResetLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang gửi...</span>
                      </div>
                    ) : (
                      "Gửi yêu cầu đặt lại mật khẩu"
                    )}
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="ghost"
                    className="w-full h-12 text-gray-600 hover:text-gray-800"
                    onClick={() => setShowResetForm(false)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại đăng nhập
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/ebcd3d17-d92b-4d28-90a3-1cec952be13a.png" 
                alt="NESA Logo" 
                className="h-20 w-auto"
              />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-gray-800 mb-3">
                Chào mừng đến với NESA
              </CardTitle>
              <p className="text-gray-600 text-lg font-medium">Nền tảng quản trị nội bộ</p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Địa chỉ email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12 transition-all duration-200"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-blue-600 hover:text-blue-800 p-0 h-auto"
                  onClick={() => setShowResetForm(true)}
                >
                  Quên mật khẩu?
                </Button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang đăng nhập...</span>
                  </div>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>

            <div className="text-center pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                © 2025 NESA Platform. Tất cả quyền được bảo lưu.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

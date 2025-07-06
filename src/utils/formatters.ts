
export function formatNumber(value: number | undefined): string {
  if (value === undefined || value === null) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
}

export function formatCurrency(value: number | undefined): string {
  if (value === undefined || value === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'Chưa xác định';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'Ngày không hợp lệ';
  }
}

export function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return 'Chưa xác định';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Ngày giờ không hợp lệ';
  }
}

export function formatTimeAgo(dateString: string | undefined): string {
  if (!dateString) return 'Chưa xác định';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Vừa xong';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} giờ trước`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ngày trước`;
    } else {
      return formatDate(dateString);
    }
  } catch (error) {
    return 'Thời gian không hợp lệ';
  }
}

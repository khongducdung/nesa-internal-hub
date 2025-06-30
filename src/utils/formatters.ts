
// Utility functions để format dữ liệu theo yêu cầu của hệ thống

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat('vi-VN').format(amount);
};

export const formatTime = (timeString: string | null | undefined): string => {
  if (!timeString) return '';
  
  const date = new Date(timeString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/,/g, '')) || 0;
};


// Utility functions để format dữ liệu theo yêu cầu của hệ thống

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  // Format theo dd/mm/yyyy (Vietnamese standard)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  // Format theo dd/mm/yyyy HH:mm
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
  if (amount === null || amount === undefined || isNaN(amount)) return '0 ₫';
  
  // Sử dụng định dạng với dấu phẩy ngăn cách hàng nghìn và ký hiệu VNĐ
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return '0';
  
  // Sử dụng định dạng với dấu phẩy ngăn cách hàng nghìn
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatTime = (timeString: string | null | undefined): string => {
  if (!timeString) return '';
  
  const date = new Date(timeString);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[,.₫]/g, '')) || 0;
};

export const formatDateInput = (date: Date | null | undefined): string => {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export const formatDateFromInput = (inputValue: string): string => {
  if (!inputValue) return '';
  
  const date = new Date(inputValue);
  if (isNaN(date.getTime())) return '';
  
  return formatDate(date.toISOString());
};

export const formatDateForDisplay = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Chưa có';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Không hợp lệ';
  
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatSalaryInput = (value: string): string => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/[^\d]/g, '');
  
  // Format with thousand separators using Vietnamese locale
  if (numericValue) {
    return parseInt(numericValue).toLocaleString('vi-VN');
  }
  return '';
};

export const parseSalaryValue = (value: string): number => {
  return parseFloat(value.replace(/[,.]/g, '')) || 0;
};

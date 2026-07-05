import XLSX from 'xlsx';

export const exportToExcel = (registrations) => {
  const data = registrations.map(reg => {
    const fullName = `${reg.title || ''} ${reg.firstName} ${reg.lastName || ''}`.trim();
    return {
      'Registration ID': reg.registrationId,
      'Name': fullName,
      'Phone': reg.mobile,
      'Email': reg.email,
      'Hospital': reg.hospital,
      'Category': reg.category,
      'Amount': reg.fee,
      'Transaction ID': reg.transactionId,
      'Payment Status': reg.paymentStatus,
      'Registration Status': reg.registrationStatus,
      'Registration Date': new Date(reg.createdAt).toLocaleDateString()
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
  
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
};

export const exportToCSV = (registrations) => {
  const data = registrations.map(reg => {
    const fullName = `${reg.title || ''} ${reg.firstName} ${reg.lastName || ''}`.trim();
    return {
      'Registration ID': reg.registrationId,
      'Name': fullName,
      'Phone': reg.mobile,
      'Email': reg.email,
      'Hospital': reg.hospital,
      'Category': reg.category,
      'Amount': reg.fee,
      'Transaction ID': reg.transactionId,
      'Payment Status': reg.paymentStatus,
      'Registration Status': reg.registrationStatus,
      'Registration Date': new Date(reg.createdAt).toLocaleDateString()
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);
  return Buffer.from(csvContent, 'utf-8');
};

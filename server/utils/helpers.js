const generateAvatar = (username) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&size=200`;
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const getWeekKey = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  return `${d.getUTCFullYear()}-W${weekNo}`;
};

const getMonthKey = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

module.exports = {
  generateAvatar,
  formatDate,
  getWeekKey,
  getMonthKey
};

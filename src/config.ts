const parseTrustProxy = (
  value: string | undefined,
): boolean | number | string => {
  if (!value) return false;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  const num = parseInt(value, 10);
  return Number.isNaN(num) ? value : num;
};

const config = {
  port: process.env.PORT || 3000,
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
};

export default config;

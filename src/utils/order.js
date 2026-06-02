/** Peran user pada order ini (bukan isSeller global di akun). */
export const getOrderParticipantRole = (order, user) => {
  if (!order || !user?.id) {
    return { isBuyer: false, isSeller: false, isAdmin: false };
  }
  return {
    isBuyer: Number(order.buyerId) === Number(user.id),
    isSeller: Number(order.sellerId) === Number(user.id),
    isAdmin: user.role === 'admin',
  };
};

/** Backend memakai alias `service` / `package`; dukung bentuk PascalCase lama. */
export const getOrderService = (order) => order?.service || order?.Service;

export const getOrderPackage = (order) => order?.package || order?.Package;

export const getOrderPrice = (order) => {
  const pkg = getOrderPackage(order);
  const raw = order?.totalPrice ?? pkg?.price ?? 0;
  const n = Number(raw);
  return Number.isNaN(n) ? 0 : n;
};

export const formatOrderPrice = (order) =>
  `Rp ${getOrderPrice(order).toLocaleString('id-ID')}`;

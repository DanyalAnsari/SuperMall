

export const formatUserData = (user) => {
  if (!user) return null;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    price: user.price,
    PhoneNumber: user.phone_number,
    address: user.fullAddress ? user.fullAddress : null,
    street: user.street ? user.street: null,
    city: user.city ? user.city: null,
    state: user.state ? user.state: null,
    zip: user.zip ? user.zip: null,
    country: user.country ? user.country: null,
    active: user.active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

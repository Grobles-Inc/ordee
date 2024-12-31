export const handleIntegrationMP = async (
  plan: any,
  user: any,
  tenant: any,
  email: any
) => {
  const { billing, name, price } = plan;
  const token = process.env.EXPO_PUBLIC_ACCESS_TOKEN_ML!;
  const preferences = {
    items: [
      {
        title: `Plan ${name}`,
        description: `Detalles: ${billing}`,
        quantity: 1,
        //currency_id for the conuntry peru is PEN
        currency_id: "PEN",
        unit_price: price,
      },
    ],
    payer: {
      name: user,
      surname: tenant,
      email: email,
    },
  };

  try {
    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      }
    );

    const data = await response.json();
    console.log(data);
    return data.init_point;
  } catch (error) {
    console.log(error);
  }
};


import { Linking } from "react-native";

export const sendWhatsAppMeessage =  (plan: any, user: any, tenant: any, email: any) => {

    const {billing, name, price} = plan;
    let typeBilling = "";
    if (billing == "monthly") {
        typeBilling = "mensual";
        }
    else {
        typeBilling = "anual";
    }
    const phoneNumber = '+51914019629';
    const message = `Hola, 

Me gustaría contratar el plan "${name}" (${typeBilling}) por un precio de S/. ${price}. 

Mis datos de contacto son:
- Nombre del Negocio: ${user}
- Correo electrónico: ${email}

Quedo atento a su confirmación. ¡Gracias!`;

    const url = `https://wa.me/${phoneNumber}?text=${message}`;

    Linking.openURL(url)
    Linking.openURL(url)
    .then(() => console.log('url', url))
    .catch(err => console.error('Error al abrir WhatsApp:', err));



  }  
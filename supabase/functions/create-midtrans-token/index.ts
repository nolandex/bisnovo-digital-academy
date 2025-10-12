import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, productName, price, quantity, customerDetails, productUrl } = await req.json();

    console.log('Received data:', {
      orderId,
      productName,
      price,
      quantity,
      customerDetails,
    });

    // Validate required fields
    if (!orderId || !productName || !price || !quantity) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const serverKey = Deno.env.get('MIDTRANS_SERVER_KEY');
    if (!serverKey) {
      throw new Error('Midtrans server key not configured');
    }

    console.log('Using server key (first 10 chars):', serverKey.substring(0, 10));
    console.log('Calling Midtrans API URL: https://app.midtrans.com/snap/v1/transactions');

    // Prepare transaction parameter for Midtrans
    const parameter: any = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price * quantity,
      },
      item_details: [
        {
          id: orderId,
          price: price,
          quantity: quantity,
          name: productName,
          category: "Digital Product",
          url: productUrl || "https://kodebisnis.com",
        },
      ],
      credit_card: {
        secure: true,
      },
    };

    // Include customer_details if provided
    if (customerDetails?.firstName?.trim() || customerDetails?.email?.trim() || customerDetails?.phone?.trim()) {
      parameter.customer_details = {};
      if (customerDetails?.firstName?.trim()) {
        parameter.customer_details.first_name = customerDetails.firstName.trim();
      }
      if (customerDetails?.email?.trim()) {
        parameter.customer_details.email = customerDetails.email.trim();
      }
      if (customerDetails?.phone?.trim()) {
        parameter.customer_details.phone = customerDetails.phone.trim();
      }
      
      // Add shipping address for Kredivo support
      if (customerDetails?.address?.trim()) {
        parameter.customer_details.shipping_address = {
          first_name: customerDetails.firstName?.trim() || "",
          phone: customerDetails.phone?.trim() || "",
          address: customerDetails.address?.trim() || "",
          city: customerDetails.city?.trim() || "",
          postal_code: customerDetails.postalCode?.trim() || "",
          country_code: "IDN"
        };
      }
    }

    console.log('Midtrans parameter:', parameter);

    // Call Midtrans API to create transaction token
    const midtransResponse = await fetch('https://app.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + btoa(serverKey + ':'),
      },
      body: JSON.stringify(parameter),
    });

    const midtransData = await midtransResponse.json();
    
    if (!midtransResponse.ok) {
      console.error('Midtrans error:', midtransData);
      throw new Error(midtransData.error_messages?.[0] || 'Failed to create transaction');
    }

    console.log('Midtrans response:', midtransData);

    return new Response(
      JSON.stringify({
        token: midtransData.token,
        redirect_url: midtransData.redirect_url,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing the request:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

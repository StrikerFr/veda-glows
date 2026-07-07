import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { getMyOrder, verifyPayment, markPaymentFailed } from "@/lib/orders.functions";
import { inr, formatDate } from "@/lib/format";
import { Check, AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ImmersiveLoader } from "@/components/ImmersiveLoader";

export const Route = createFileRoute("/_authenticated/order/$id")({
  head: () => ({ meta: [{ title: "Order Details - VedaGlows" }] }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const fetchOrder = useServerFn(getMyOrder);
  const verify = useServerFn(verifyPayment);
  const markFailed = useServerFn(markPaymentFailed);
  const [retrying, setRetrying] = useState(false);

  const { data, isLoading, refetch } = useQuery({ queryKey: ["order", id], queryFn: () => fetchOrder({ data: { id } }) });
  const order = data?.order;
  const keyId = data?.keyId;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function handleRetry() {
    if (!order || !order.razorpay_order_id || !keyId) return;
    
    const options = {
      key: keyId,
      amount: Math.round(Number(order.total) * 100),
      currency: "INR",
      name: "VedaGlows",
      description: "28-Day Skin Reset Ritual",
      order_id: order.razorpay_order_id,
      handler: async function (response: any) {
        try {
          toast.loading("Verifying payment...", { id: "verify" });
          await verify({
            data: {
              orderId: order.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
          });
          toast.success("Payment successful!", { id: "verify" });
          refetch();
        } catch (err) {
          toast.error("Payment verification failed.", { id: "verify" });
          refetch();
        }
      },
      prefill: {
        name: order.customer_name,
        email: order.customer_email,
        contact: order.customer_phone,
      },
      theme: {
        color: "#0E2F25",
      },
      notes: {
        order_id: order.id,
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', async function () {
       toast.error("Payment failed. Please try again.");
       await markFailed({ data: { orderId: order.id } });
       refetch();
    });
    rzp.open();
  }

  return (
    <main className="min-h-screen bg-[color:var(--ivory)] pb-20">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 pt-28 md:pt-32">
        {isLoading || !order ? (
          <ImmersiveLoader message="Loading order details…" />
        ) : (
          <>
            <div className="text-center">
              {order.payment_status === "paid" || order.payment_method === "cod" ? (
                <>
                  <div className="mx-auto h-16 w-16 rounded-full bg-green-100 grid place-items-center">
                    <Check className="h-8 w-8 text-green-700" />
                  </div>
                  <h1 className="mt-5 font-serif italic text-4xl">Order Confirmed</h1>
                  <p className="mt-2 text-sm text-foreground/60">Thank you for choosing VedaGlows. We'll be in touch shortly.</p>
                </>
              ) : (
                <>
                  <div className="mx-auto h-16 w-16 rounded-full bg-red-100 grid place-items-center">
                    <AlertCircle className="h-8 w-8 text-red-700" />
                  </div>
                  <h1 className="mt-5 font-serif italic text-4xl">Payment {order.payment_status === "failed" ? "Failed" : "Pending"}</h1>
                  <p className="mt-2 text-sm text-foreground/60">Your order is saved, but the payment is not complete.</p>
                  
                  <button 
                    onClick={handleRetry}
                    className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs tracking-widest uppercase text-white shadow-md transition-opacity hover:opacity-90" 
                    style={{ background: "#0E2C5A" }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry Payment
                  </button>
                </>
              )}
              <div className="mt-5 font-mono text-sm text-foreground bg-white/50 inline-block px-4 py-2 rounded-lg border border-black/5">{order.order_number}</div>
            </div>

            <div className="mt-8 rounded-3xl bg-white p-6 border border-foreground/5 shadow-sm relative overflow-hidden">
              <div className="text-xs uppercase tracking-widest text-foreground/50 mb-4">Order Summary</div>
              
              <div className="space-y-3 text-sm">
                {order.order_items?.map((i: any) => (
                  <div key={i.id} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">{i.product_name}</span>
                      <span className="text-xs text-gray-500">Qty: {i.quantity}</span>
                    </div>
                    <span className="font-medium">{inr(Number(i.line_total))}</span>
                  </div>
                ))}
                
                <div className="border-t border-foreground/10 pt-4 mt-4 space-y-2">
                  <div className="flex justify-between text-foreground/70 text-sm"><span>Subtotal</span><span>{inr(Number(order.subtotal))}</span></div>
                  {Number(order.discount) > 0 && <div className="flex justify-between text-green-700 text-sm"><span>Discount</span><span>− {inr(Number(order.discount))}</span></div>}
                  <div className="flex justify-between text-foreground/70 text-sm"><span>Shipping</span><span className="text-green-700">FREE</span></div>
                  <div className="flex justify-between font-serif text-xl pt-3 mt-1 border-t border-dashed border-gray-200 text-gray-900">
                    <span>Total</span>
                    <span>{inr(Number(order.total))}</span>
                  </div>
                  {order.payment_method === 'cod' && (
                    <div className="pt-3 mt-2 border-t border-gray-100 space-y-1.5 text-sm">
                      <div className="flex justify-between text-green-700">
                        <span>Advance Paid</span>
                        <span>{inr(Math.min(Number(order.total), 40))}</span>
                      </div>
                      <div className="flex justify-between font-medium text-gray-900">
                        <span>Balance Due (Pay on Delivery)</span>
                        <span>{inr(Math.max(0, Number(order.total) - 40))}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 rounded-xl p-4 text-sm" style={{ background: "rgba(201,168,106,0.1)", border: "1px solid rgba(201,168,106,0.2)" }}>
                <div className="font-semibold text-gray-800 mb-1">Shipping To</div>
                <div className="font-medium">{order.customer_name}</div>
                <div className="text-foreground/70 text-xs mt-1 leading-relaxed">
                  {(() => { const a = order.shipping_address as any; return `${a?.line1 ?? ""}, ${a?.city ?? ""}, ${a?.state ?? ""} ${a?.pincode ?? ""}`; })()}
                </div>
                <div className="text-foreground/70 text-xs mt-1.5 flex flex-col gap-0.5">
                  <span>{order.customer_phone}</span>
                  <span>{order.customer_email}</span>
                </div>
              </div>
              
              <div className="mt-5 flex justify-between text-xs text-foreground/60 px-1 items-center">
                <span>{formatDate(order.created_at)}</span>
                <span className="font-medium px-2 py-1 bg-gray-100 rounded-md">Payment: {order.payment_method.toUpperCase()}</span>
              </div>

              <div className="mt-6 pt-5 border-t border-dashed border-gray-200 text-center text-xs text-foreground/60 space-y-1.5">
                <p className="font-medium text-foreground/80">Need help with your order?</p>
                <p>Email: <a href="mailto:vedaglows@gmail.com" className="text-[#143A2A] hover:underline">vedaglows@gmail.com</a></p>
                <p>Phone / WhatsApp: <a href="tel:+919058964964" className="text-[#143A2A] hover:underline">+91 90589 64964</a></p>
              </div>
            </div>

            <div className="mt-8 flex gap-3 justify-center">
              <Link to="/account" className="rounded-full px-6 py-3 text-xs tracking-widest uppercase border border-foreground/20 hover:bg-black/5 transition-colors">View Orders</Link>
              <Link to="/" className="rounded-full px-6 py-3 text-xs tracking-widest uppercase text-primary-foreground transition-opacity hover:opacity-90 shadow-md" style={{ background: "#143A2A" }}>Continue Shopping</Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

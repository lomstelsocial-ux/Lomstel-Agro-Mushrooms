import React, { useState } from 'react';
import { MessageCircle, Send, CheckCircle2, ShieldCheck, ShoppingCart, ArrowRight } from 'lucide-react';
import { CustomerType, Order } from '../../types';
import { DataService } from '../../services/supabase';
import { openWhatsApp, getWhatsAppUrl, WHATSAPP_PHONE } from '../../utils/whatsapp';

interface OrderSectionProps {
  onOrderSuccess?: (order: Order) => void;
}

export const OrderSection: React.FC<OrderSectionProps> = ({ onOrderSuccess }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    product: 'Lomstel Fresh Oyster Mushrooms',
    quantity: '1kg Fresh (2 packs)',
    customer_type: 'Home & Family' as CustomerType,
    delivery_location: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const productOptions = [
    'Lomstel Fresh Oyster Mushrooms',
    'Lomstel Dried Oyster Mushrooms',
    'Wholesale / Bulk Supply'
  ];

  const customerTypes: CustomerType[] = [
    'Home & Family',
    'Restaurant',
    'Hotel',
    'Supermarket',
    'Caterer',
    'Retailer',
    'Wholesale',
    'Other'
  ];

  const quantitySuggestions = [
    '500g Fresh Pack',
    '1kg Fresh (2 packs)',
    '2kg Fresh (4 packs)',
    '5kg Fresh (Family / Bulk)',
    '250g Dried Pouch',
    '500g Dried Pouch',
    '10kg+ Commercial Wholesale Weekly'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Form validation
    if (!formData.customer_name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setValidationError('Please provide a valid phone or WhatsApp number.');
      return;
    }
    if (!formData.delivery_location.trim()) {
      setValidationError('Please enter your delivery city or address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await DataService.createOrder({
        customer_name: formData.customer_name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || 'N/A',
        product: formData.product,
        quantity: formData.quantity,
        customer_type: formData.customer_type,
        delivery_location: formData.delivery_location.trim(),
        message: formData.message.trim() || undefined
      });

      setSubmittedOrder(order);
      if (onOrderSuccess) {
        onOrderSuccess(order);
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setValidationError('Failed to record order. You can still order directly on WhatsApp below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppMessageForOrder = (order: Order) => {
    return `Hello Lomstel Agro, I just submitted an order on your website!

*Order ID:* ${order.id}
*Customer Name:* ${order.customer_name}
*Customer Type:* ${order.customer_type}
*Phone:* ${order.phone}
*Product:* ${order.product}
*Quantity:* ${order.quantity}
*Delivery Location:* ${order.delivery_location}
${order.message ? `*Notes:* ${order.message}` : ''}

Please confirm availability, price, and delivery arrangement. Thank you!`;
  };

  return (
    <section id="order" className="py-20 lg:py-28 bg-white border-b border-[#EAF4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Direct WhatsApp CTAs */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#146B4A] tracking-wider uppercase mb-3">
            <span className="w-5 h-0.5 bg-[#146B4A]" />
            <span>Farm Direct Ordering</span>
            <span className="w-5 h-0.5 bg-[#146B4A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight mb-4 font-display">
            READY TO ADD MORE GOODNESS TO YOUR MEALS?
          </h2>

          <p className="text-base sm:text-lg text-slate-700 mb-8">
            Order fresh or dried Lomstel Oyster Mushrooms today. Quick delivery across Ogun State, Lagos, and surrounding areas.
          </p>

          {/* Quick Direct WhatsApp Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => openWhatsApp('Hello Lomstel Agro, I would like to order Fresh Oyster Mushrooms. Please send me the available sizes, prices and delivery options.')}
              className="flex items-center gap-2 px-5 py-3 bg-[#146B4A] hover:bg-[#0B3D2E] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>ORDER FRESH MUSHROOMS</span>
            </button>

            <button
              onClick={() => openWhatsApp('Hello Lomstel Agro, I would like to order Dried Oyster Mushrooms. Please send me the available sizes, prices and delivery options.')}
              className="flex items-center gap-2 px-5 py-3 bg-[#D4A72C] hover:bg-[#b88f22] text-[#0B3D2E] text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>ORDER DRIED MUSHROOMS</span>
            </button>

            <button
              onClick={() => openWhatsApp('Hello Lomstel Agro, I am interested in wholesale/bulk oyster mushroom supply. Please send me your wholesale prices and minimum order quantities.')}
              className="flex items-center gap-2 px-5 py-3 bg-white text-[#0B3D2E] hover:bg-[#EAF4EE] text-xs sm:text-sm font-bold border border-[#146B4A]/30 rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#146B4A]" />
              <span>WHOLESALE ORDER</span>
            </button>
          </div>
        </div>

        {/* Interactive Order Form Container */}
        <div className="max-w-3xl mx-auto bg-[#F7F8F4] rounded-3xl p-6 sm:p-10 border border-[#EAF4EE] shadow-lg">
          
          <div className="flex items-center justify-between border-b border-[#EAF4EE] pb-5 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#146B4A] text-white flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B3D2E] font-display">
                  Official Mushroom Order Form
                </h3>
                <p className="text-xs text-slate-500">
                  Submit here and immediately connect with our sales desk on WhatsApp
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#146B4A] bg-white px-2.5 py-1 rounded-md border border-[#EAF4EE]">
              <ShieldCheck className="w-3.5 h-3.5" /> NAFDAC: A8-121508L
            </span>
          </div>

          {/* Success Screen after Order Submit */}
          {submittedOrder ? (
            <div className="bg-white rounded-2xl p-8 border border-[#146B4A]/30 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#EAF4EE] text-[#146B4A] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="text-xs font-bold text-[#146B4A] tracking-wider uppercase block mb-1">
                Order Logged Successfully!
              </span>

              <h4 className="text-2xl font-bold text-[#0B3D2E] font-display mb-2">
                Thank You, {submittedOrder.customer_name}!
              </h4>

              <p className="text-sm text-slate-600 mb-6 max-w-lg mx-auto">
                Your order for <strong className="text-[#0B3D2E]">{submittedOrder.product} ({submittedOrder.quantity})</strong> has been registered in our system (Reference: <span className="font-mono font-bold text-[#146B4A]">{submittedOrder.id}</span>).
              </p>

              <div className="bg-[#F7F8F4] p-4 rounded-xl text-left text-xs text-slate-700 max-w-md mx-auto mb-8 border border-[#EAF4EE] space-y-1.5">
                <p><strong>Customer:</strong> {submittedOrder.customer_name} ({submittedOrder.customer_type})</p>
                <p><strong>Phone:</strong> {submittedOrder.phone}</p>
                <p><strong>Delivery Location:</strong> {submittedOrder.delivery_location}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getWhatsAppUrl(generateWhatsAppMessageForOrder(submittedOrder))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl shadow-md transition-all duration-150"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>CONFIRM ON WHATSAPP NOW</span>
                </a>

                <button
                  onClick={() => setSubmittedOrder(null)}
                  className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Place Another Order
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {validationError && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  {validationError}
                </div>
              )}

              {/* Row 1: Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="e.g. Mrs. Funke Adebayo"
                    className="w-full px-4 py-3 bg-white border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-2">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0812 345 6789"
                    className="w-full px-4 py-3 bg-white border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                  />
                </div>
              </div>

              {/* Row 2: Email & Customer Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. funke@example.com"
                    className="w-full px-4 py-3 bg-white border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-2">
                    Customer Type *
                  </label>
                  <select
                    value={formData.customer_type}
                    onChange={(e) => setFormData({ ...formData, customer_type: e.target.value as CustomerType })}
                    className="w-full px-4 py-3 bg-white border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                  >
                    {customerTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Product Choice & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-2">
                    Product *
                  </label>
                  <select
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                  >
                    {productOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-2">
                    Quantity / Packaging *
                  </label>
                  <input
                    type="text"
                    required
                    list="quantities"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 2kg Fresh or 500g Dried"
                    className="w-full px-4 py-3 bg-white border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                  />
                  <datalist id="quantities">
                    {quantitySuggestions.map(q => <option key={q} value={q} />)}
                  </datalist>
                </div>
              </div>

              {/* Row 4: Delivery Location */}
              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-2">
                  Delivery Location (City / Street Address) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.delivery_location}
                  onChange={(e) => setFormData({ ...formData, delivery_location: e.target.value })}
                  placeholder="e.g. Abeokuta, Ogun State OR Ikeja GRA, Lagos"
                  className="w-full px-4 py-3 bg-white border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                />
              </div>

              {/* Row 5: Additional Message */}
              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-2">
                  Additional Message / Special Instructions
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Specify delivery timing, recurring supply requests, or culinary preferences..."
                  className="w-full px-4 py-3 bg-white border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                />
              </div>

              {/* Form Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#146B4A] hover:bg-[#0B3D2E] active:scale-[0.99] text-white text-base font-bold rounded-xl shadow-md transition-all duration-150 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Recording Order...' : 'SUBMIT ORDER & GENERATE WHATSAPP'}</span>
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, MessageCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { CustomerType, Order } from '../../types';
import { DataService } from '../../services/supabase';
import { openWhatsApp, getWhatsAppUrl } from '../../utils/whatsapp';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: string;
  onOrderCreated?: (order: Order) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  defaultProduct,
  onOrderCreated
}) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    product: defaultProduct || 'Lomstel Fresh Oyster Mushrooms',
    quantity: '1kg Fresh (2 packs)',
    customer_type: 'Home & Family' as CustomerType,
    delivery_location: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultProduct) {
      setFormData(prev => ({ ...prev, product: defaultProduct }));
    }
  }, [defaultProduct]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.customer_name.trim() || !formData.phone.trim() || !formData.delivery_location.trim()) {
      setError('Please fill in Name, Phone, and Delivery Location.');
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
      if (onOrderCreated) {
        onOrderCreated(order);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to record order. Please order via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppMessage = (order: Order) => {
    return `Hello Lomstel Agro, I would like to confirm my oyster mushroom order:
*Order Ref:* ${order.id}
*Name:* ${order.customer_name} (${order.customer_type})
*Phone:* ${order.phone}
*Product:* ${order.product}
*Quantity:* ${order.quantity}
*Location:* ${order.delivery_location}
${order.message ? `*Notes:* ${order.message}` : ''}
Please confirm availability and dispatch time.`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-[#EAF4EE]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedOrder ? (
          <div className="text-center py-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-[#EAF4EE] text-[#146B4A] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-[#0B3D2E] mb-2 font-display">
              Order Recorded!
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Reference #{submittedOrder.id}. Now finalize your harvest order directly on WhatsApp with our representative.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={getWhatsAppUrl(getWhatsAppMessage(submittedOrder))}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>CONFIRM ON WHATSAPP</span>
              </a>
              <button
                onClick={() => {
                  setSubmittedOrder(null);
                  onClose();
                }}
                className="text-xs text-slate-500 hover:text-slate-800 py-2"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-[#EAF4EE] text-[#146B4A]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#0B3D2E] font-display">
                Quick Order Form
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Lomstel Agro · NAFDAC REG. NO: A8-121508L
            </p>

            {error && (
              <div className="p-3 mb-4 bg-red-50 text-red-700 text-xs rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0B3D2E] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812..."
                    className="w-full px-3.5 py-2.5 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B3D2E] mb-1">Customer Type</label>
                  <select
                    value={formData.customer_type}
                    onChange={(e) => setFormData({ ...formData, customer_type: e.target.value as CustomerType })}
                    className="w-full px-3.5 py-2.5 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                  >
                    <option value="Home & Family">Home & Family</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Supermarket">Supermarket</option>
                    <option value="Caterer">Caterer</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Wholesale">Wholesale</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0B3D2E] mb-1">Product *</label>
                  <select
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                  >
                    <option value="Lomstel Fresh Oyster Mushrooms">Fresh Oyster</option>
                    <option value="Lomstel Dried Oyster Mushrooms">Dried Oyster</option>
                    <option value="Wholesale / Bulk Supply">Wholesale Supply</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B3D2E] mb-1">Quantity *</label>
                  <input
                    type="text"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 2kg or 500g"
                    className="w-full px-3.5 py-2.5 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] mb-1">Delivery Location *</label>
                <input
                  type="text"
                  required
                  value={formData.delivery_location}
                  onChange={(e) => setFormData({ ...formData, delivery_location: e.target.value })}
                  placeholder="Address, town, or city in Nigeria"
                  className="w-full px-3.5 py-2.5 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3D2E] mb-1">Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Special instructions or timing..."
                  className="w-full px-3.5 py-2 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#146B4A] hover:bg-[#0B3D2E] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'SUBMIT ORDER'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

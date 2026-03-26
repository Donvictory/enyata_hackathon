import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  User, 
  Calendar, 
  CheckCircle, 
  Navigation, 
  CreditCard,
  ArrowRight,
  Star,
  Clock,
  ShieldCheck,
  ChevronLeft,
  X,
  Smartphone,
  Sparkles,
  Ticket
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../Components/ui/card";
import { toast } from "sonner";
import { addBooking, isPremiumUser, getBookings } from "../lib/storage";

const PARTNERS = [
  {
    id: "nutri-01",
    name: "Dr. Amara Okoro",
    role: "Clinical Nutritionist",
    specialty: "Diabetes & BMI Drift",
    price: 15000,
    rating: 4.9,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200",
    description: "Expert in metabolic health and dietary interventions for stabilizing weight drift."
  },
  {
    id: "fit-01",
    name: "Coach Tunde Maxwell",
    role: "Fitness & Mobility Coach",
    specialty: "Sedentary Drift Recovery",
    price: 12000,
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200&h=200",
    description: "Specializing in corrective exercise and habit-forming routines for office workers."
  },
  {
    id: "thera-01",
    name: "Sarah Williams, MHC",
    role: "Mental Health Therapist",
    specialty: "Stress & Burnout Drift",
    price: 20000,
    rating: 5.0,
    reviews: 216,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
    description: "Compassionate care for high-performers experiencing cognitive load and emotional exhaustion."
  }
];

export function GetHelp() {
  const navigate = useNavigate();
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState("select"); // select, interswitch, success
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);

  const handlePartnerSelect = (partner) => {
    setSelectedPartner(partner);
    setShowBookingModal(true);
    setPaymentStep("details");
  };

  const initiateInterswitch = () => {
    setIsProcessing(true);
    
    // Simulate Interswitch Web Checkout initialization
    // In a real app, you'd fetch the transaction reference and merchant details from your backend
    const txRef = `DRFT-${Date.now()}`;
    const amount = selectedPartner.price * 100; // In Kobo
    
    console.log("Initializing Interswitch with:", { txRef, amount });

    // Simulate Interswitch Modal Response
    setTimeout(() => {
      handlePaymentResponse({
        respCode: "00",
        respDescription: "Approved",
        transactionReference: txRef,
        amount: amount,
        paymentDate: new Date().toISOString()
      });
    }, 2000);
  };

  /**
   * @param {Object} response - Strict Interswitch Response object
   * @param {string} response.respCode - '00' for success
   * @param {string} response.respDescription - Description from gateway
   * @param {string} response.transactionReference - Unique transaction ID
   * @param {number} response.amount - Amount in Kobo
   * @param {string} response.paymentDate - ISO string date
   */
  const handlePaymentResponse = (response) => {
    setIsProcessing(false);
    
    if (response.respCode === "00") {
      const booking = {
        partnerId: selectedPartner.id,
        partnerName: selectedPartner.name,
        amount: response.amount / 100,
        txRef: response.transactionReference,
        status: "confirmed",
        passId: `PASS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      };
      
      addBooking(booking);
      setActiveBooking(booking);
      setPaymentStep("success");
      toast.success("Payment Successful! Your session is booked.");
    } else {
      toast.error("Payment failed. Please try again.");
    }
  };

  const closeModals = () => {
    setShowBookingModal(false);
    setPaymentStep("details");
    setSelectedPartner(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/30 pb-32">
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between pt-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="rounded-full h-12 w-12 p-0 bg-white shadow-sm border border-gray-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Care Marketplace</h1>
            <p className="text-sm text-gray-500 font-medium">Verified partners to stabilize your drift</p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
             <div className="bg-emerald-100 p-2.5 rounded-2xl">
               <ShieldCheck className="w-6 h-6 text-emerald-600" />
             </div>
          </div>
        </header>

        {/* Promo Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100"
        >
          <div className="relative z-10 space-y-4 max-w-sm">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Premium Access</span>
            <h2 className="text-2xl font-black">Get 100 Health Points on every booking.</h2>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed">Stable patterns unlocked. Professional consultations starting from ₦12,000.</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-50">
             <Sparkles className="w-48 h-48 text-indigo-400 rotate-12" />
          </div>
        </motion.div>

        {/* Categories / Partner Cards */}
        <div className="grid gap-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 px-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Recommended for your Drift
          </h3>
          
          <div className="flex flex-col gap-5">
            {PARTNERS.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="border-none shadow-xl shadow-black/[0.03] rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all hover:translate-y-[-4px]"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0">
                         <img 
                            src={partner.image} 
                            alt={partner.name}
                            className="w-20 h-20 rounded-3xl object-cover shadow-md border-2 border-white" 
                         />
                         <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-xl shadow-sm border border-gray-50">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                         </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-900 truncate">{partner.name}</h4>
                          <span className="text-emerald-600 font-black text-sm">₦{(partner.price).toLocaleString()}</span>
                        </div>
                        <p className="text-xs font-bold text-blue-600 mb-1">{partner.role}</p>
                        <div className="flex items-center gap-2 mb-3">
                           <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight italic">
                              {partner.specialty}
                           </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">
                          {partner.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-50">
                       <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                             <Clock className="w-4 h-4 text-gray-400" />
                             <span className="text-xs font-bold text-gray-500">45-min Session</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                             <User className="w-4 h-4 text-gray-400" />
                             <span className="text-xs font-bold text-gray-500">{partner.reviews} Reviews</span>
                          </div>
                       </div>
                       <Button 
                          onClick={() => handlePartnerSelect(partner)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-5 h-10 font-bold text-sm"
                        >
                         Book Now
                         <ArrowRight className="w-4 h-4 ml-1" />
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModals}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-lg bg-white rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                 {/* Success State */}
                 {paymentStep === "success" ? (
                   <div className="text-center py-6 space-y-6">
                      <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg shadow-emerald-50 relative">
                         <CheckCircle className="w-12 h-12 text-emerald-600" />
                         <motion.div 
                           animate={{ scale: [1, 1.2, 1] }}
                           transition={{ repeat: Infinity, duration: 2 }}
                           className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 p-1.5 rounded-xl border-2 border-white"
                         >
                            <Sparkles className="w-4 h-4" />
                         </motion.div>
                      </div>
                      
                      <div className="space-y-2">
                         <h2 className="text-3xl font-black text-gray-900">Booking Confirmed!</h2>
                         <p className="text-gray-500 font-medium">You've unlocked Premium status for stabilizing your drift.</p>
                      </div>

                      {/* Consultation Pass Card */}
                      <div className="relative mt-8 group">
                         <div className="absolute inset-0 bg-emerald-600 rounded-[2.5rem] rotate-2 scale-105 opacity-10 blur-xl" />
                         <div className="relative bg-emerald-900 rounded-[2.5rem] p-8 text-white border-4 border-emerald-800 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                               <Ticket className="w-32 h-32 -rotate-12" />
                            </div>
                            
                            <div className="flex items-center gap-4 mb-8">
                               <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center">
                                  <Ticket className="w-8 h-8 text-emerald-400" />
                               </div>
                               <div className="text-left">
                                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-400/80">Consultation Pass</p>
                                  <h4 className="text-xl font-bold tracking-tight">{selectedPartner?.name}</h4>
                               </div>
                            </div>

                            <div className="space-y-6">
                               <div className="flex justify-between border-b border-white/10 pb-4">
                                  <div className="text-left">
                                      <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Pass ID</p>
                                      <p className="text-sm font-mono font-bold tracking-widest">{activeBooking?.passId}</p>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Valid Until</p>
                                      <p className="text-sm font-bold">April 02, 2026</p>
                                  </div>
                               </div>
                               <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/10">
                                  <div className="flex flex-col items-start gap-1">
                                     <p className="text-[10px] uppercase font-bold text-white/40">Status</p>
                                     <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                        <span className="text-xs font-black uppercase tracking-wider">Active</span>
                                     </div>
                                  </div>
                                  <Smartphone className="w-6 h-6 text-white/20" />
                               </div>
                            </div>
                         </div>
                      </div>

                      <Button 
                         onClick={() => navigate("/dashboard")}
                         className="w-full h-14 bg-gray-900 text-white hover:bg-black rounded-2xl font-black mt-8 text-lg flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
                      >
                         Go to Dashboard
                      </Button>
                   </div>
                 ) : (
                   <>
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">Session Details</h3>
                        <p className="text-sm text-gray-500 font-medium">{selectedPartner?.role}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        onClick={closeModals}
                        className="rounded-full h-10 w-10 p-0 hover:bg-gray-100"
                      >
                        <X className="w-6 h-6" />
                      </Button>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                         <img 
                            src={selectedPartner?.image} 
                            alt={selectedPartner?.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                         />
                         <div>
                            <p className="text-xs uppercase font-black text-gray-400 tracking-widest mb-1">With Specialist</p>
                            <h4 className="text-lg font-bold text-gray-900">{selectedPartner?.name}</h4>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-sm font-bold text-gray-700">
                            <span>Session Fee</span>
                            <span>₦{selectedPartner?.price.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between items-center text-sm font-bold text-gray-700">
                            <span>Drift Analysis Sync</span>
                            <span className="text-emerald-600 font-black">FREE</span>
                         </div>
                         <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-lg font-black text-gray-900">Total</span>
                            <span className="text-2xl font-black text-emerald-600">₦{selectedPartner?.price.toLocaleString()}</span>
                         </div>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                         <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                         <p className="text-[11px] font-bold text-amber-800 leading-relaxed uppercase tracking-tighter">
                            By proceeding, your data (Resilience Tank & Drift Analysis) will be securely shared with the specialist via Interswitch ISW-Connect.
                         </p>
                      </div>

                      <Button 
                        disabled={isProcessing}
                        onClick={initiateInterswitch}
                        className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-blue-100 relative overflow-hidden group"
                      >
                        {isProcessing ? (
                           <motion.div 
                             animate={{ rotate: 360 }}
                             transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                             className="w-6 h-6 border-4 border-white border-t-transparent rounded-full"
                           />
                        ) : (
                          <>
                           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform">
                              <CreditCard className="w-12 h-12" />
                           </div>
                           <CreditCard className="w-6 h-6" />
                           Pay with Interswitch
                          </>
                        )}
                      </Button>
                      
                      <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.25em]">
                         Secured by ISW WebCheckout v4.2
                      </p>
                    </div>
                   </>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../hooks/use-cart";
import { useToast } from "../hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "../ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const checkoutFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State/Province must be at least 2 characters"),
  zipCode: z.string().min(4, "Zip/Postal code must be at least 4 characters"),
  country: z.string().min(2, "Please select a country"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const Checkout = () => {
  const router = useRouter();
  const { cartItemsWithDetails, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItemsWithDetails.length === 0 && !orderComplete) {
      router.push('/cart')
    }
  }, [cartItemsWithDetails.length, orderComplete, router])

  const subtotal = useMemo(() => {
    return cartItemsWithDetails.reduce(
      (total, item) => total + item.artwork.price * item.quantity,
      0
    );
  }, [cartItemsWithDetails]);

  // Fixed shipping fee
  const shippingFee = 150;
  
  const total = subtotal + shippingFee;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      paymentMethod: "",
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      notes: ""
    },
  });

  const selectedPaymentMethod = form.watch("paymentMethod");

  const handleSubmit = (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    
    // Simulate checkout process
    setTimeout(() => {
      // Generate a random order ID
      const randomOrderId = "ORDER-" + Math.floor(100000 + Math.random() * 900000);
      setOrderId(randomOrderId);
      setOrderComplete(true);
      clearCart();
      setIsSubmitting(false);
    }, 2000);
  };

  if (orderComplete) {
    return (
      <>
        {/* SEO head tags typically handled in server components or layout */}
        <div className="pt-24 md:pt-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">
                Thank You for Your Order!
              </h1>
              <p className="text-lg text-neutral-700 mb-6">
                Your order has been received and is being processed.
              </p>
              <div className="bg-neutral-50 p-6 rounded-md mb-8">
                <h2 className="text-xl font-['Playfair_Display'] font-semibold text-neutral-900 mb-4">
                  Order Details
                </h2>
                <p className="text-neutral-700 mb-2">
                  <span className="font-medium">Order Number:</span> {orderId}
                </p>
                <p className="text-neutral-700">
                  <span className="font-medium">Order Total:</span> {formatCurrency(total)}
                </p>
              </div>
              <p className="text-neutral-600 mb-8">
                We've sent a confirmation email with all the details of your order. If you have any questions, please contact our customer service team.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/">
                  <Button className="bg-[#D3A265] hover:bg-opacity-90 text-white font-medium px-6 py-3">
                    Return to Home
                  </Button>
                </Link>
                <Link href="/artworks">
                  <Button variant="outline" className="px-6 py-3">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* SEO head tags are typically handled in server components or layout */}
      <div className="pt-24 md:pt-32">
        <div className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 text-center">
              Checkout
            </h1>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                  <div>
                    <h2 className="text-xl font-['Playfair_Display'] font-semibold mb-6">Shipping Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Email address" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="mt-6">
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Street address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-6 mt-6">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input placeholder="State/Province" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mt-6">
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip/Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Zip/Postal code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="south-africa">South Africa</SelectItem>
                                <SelectItem value="usa">United States</SelectItem>
                                <SelectItem value="uk">United Kingdom</SelectItem>
                                <SelectItem value="canada">Canada</SelectItem>
                                <SelectItem value="australia">Australia</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h2 className="text-xl font-['Playfair_Display'] font-semibold mb-6">Payment Method</h2>
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="credit-card">Credit Card</SelectItem>
                              <SelectItem value="paypal">PayPal</SelectItem>
                              <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {selectedPaymentMethod === "credit-card" && (
                      <div className="mt-6 space-y-6">
                        <FormField
                          control={form.control}
                          name="cardName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name on Card</FormLabel>
                              <FormControl>
                                <Input placeholder="Full name as displayed on card" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input placeholder="xxxx xxxx xxxx xxxx" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="cardExpiry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiration Date</FormLabel>
                                <FormControl>
                                  <Input placeholder="MM/YY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cardCvc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVC</FormLabel>
                                <FormControl>
                                  <Input placeholder="CVC" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {selectedPaymentMethod === "bank-transfer" && (
                      <div className="mt-6 p-4 bg-neutral-50 rounded-md">
                        <p className="text-neutral-700 text-sm">
                          Please use the following details to make your bank transfer. Include your name and email in the reference.
                          We will process your order once payment is received.
                        </p>
                        <div className="mt-4 space-y-2 text-sm">
                          <p><span className="font-medium">Bank:</span> African Art Bank</p>
                          <p><span className="font-medium">Account Name:</span> Imbayedu Art Collective</p>
                          <p><span className="font-medium">Account Number:</span> 123456789</p>
                          <p><span className="font-medium">Sort Code:</span> 12-34-56</p>
                          <p><span className="font-medium">SWIFT/BIC:</span> ABCDEFGH</p>
                        </div>
                      </div>
                    )}

                    {selectedPaymentMethod === "paypal" && (
                      <div className="mt-6 p-4 bg-neutral-50 rounded-md">
                        <p className="text-neutral-700 text-sm">
                          You will be redirected to PayPal to complete your payment after placing the order.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Special instructions for delivery or anything we should know about your order"
                            className="min-h-[100px] resize-y"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      type="submit"
                      className="bg-[#D3A265] hover:bg-opacity-90 text-white font-medium py-3 px-8"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                    
                    <Link href="/cart">
                      <Button 
                        type="button"
                        variant="outline"
                        className="py-3 px-8"
                      >
                        Return to Cart
                      </Button>
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-neutral-50 p-6 rounded-md sticky top-32">
                <h3 className="text-lg font-['Playfair_Display'] font-semibold mb-6 pb-4 border-b border-gray-200">
                  Order Summary
                </h3>
                
                <div className="space-y-4 mb-6">
                  {cartItemsWithDetails.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img 
                        src={item.artwork.imageUrl} 
                        alt={item.artwork.title} 
                        className="w-16 h-16 object-cover rounded-sm"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-neutral-900">{item.artwork.title}</h4>
                        <p className="text-xs text-neutral-500">Artist: {item.artwork.artist.name}</p>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-neutral-700">Qty: {item.quantity}</span>
                          <span className="text-sm font-medium">{formatCurrency(item.artwork.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-medium">{formatCurrency(shippingFee)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-gray-200 mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-semibold">{formatCurrency(total)}</span>
                </div>
                
                <div className="text-center text-sm text-neutral-500">
                  <p>Taxes calculated at checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;

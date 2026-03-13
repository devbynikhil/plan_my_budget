"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Coffee,
  Heart,
  Star,
  Gift,
  Smartphone,
  CreditCard,
  Banknote,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

function UpgradePage() {
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  let user = null;
  try {
    const userHook = useUser();
    user = userHook.user;
  } catch (error) {
    console.warn("Clerk not available in UpgradePage:", error.message);
  }

  const predefinedAmounts = [50, 100, 200, 500, 1000]; // Indian Rupee amounts

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount("");
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setIsCustom(true);
    setSelectedAmount(0);
  };

  const getFinalAmount = () => {
    return isCustom ? parseFloat(customAmount) || 0 : selectedAmount;
  };

  const handleUPIPayment = () => {
    const amount = getFinalAmount();
    if (amount < 1) {
      alert("Please select or enter an amount of at least ₹1");
      return;
    }

    // Replace with your actual UPI ID
    const upiId = "rockstaralansaji@oksbi"; // Change this to your actual UPI ID
    const upiUrl = `upi://pay?pa=${upiId}&pn=Plan_My_Budget Support&am=${amount}&cu=INR&tn=Support for Plan_My_Budget Development`;

    // Try to open UPI app, fallback to showing UPI ID
    const link = document.createElement("a");
    link.href = upiUrl;
    link.click();

    // Show UPI ID as fallback
    setTimeout(() => {
      alert(
        `UPI ID: ${upiId}\nAmount: ₹${amount}\n\nIf UPI app didn't open, you can manually send payment using this UPI ID.`,
      );
    }, 1000);
  };

  const handleRazorpay = () => {
    const amount = getFinalAmount();
    if (amount < 1) {
      alert("Please select or enter an amount of at least ₹1");
      return;
    }

    // This would integrate with Razorpay
    // For now, redirect to a payment link or show instructions
    alert(
      `Razorpay integration coming soon!\n\nFor now, you can support us via UPI: your-upi-id@paytm\nAmount: ₹${amount}`,
    );
  };

  const handlePaytm = () => {
    const amount = getFinalAmount();
    if (amount < 1) {
      alert("Please select or enter an amount of at least ₹1");
      return;
    }

    // Replace with your Paytm number or payment link
    const paytmNumber = "8078255829"; // Change this to your actual Paytm number
    alert(
      `Send ₹${amount} to Paytm: ${paytmNumber}\n\nNote: Plan_My_Budget Development Support`,
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Coffee className="text-amber-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">
            Support Plan_My_Budget
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Support the development of Plan_My_Budget and help keep it free for
          everyone!
        </p>
        <p className="text-sm text-gray-500 mt-2">
          🇮🇳 Indian payment methods supported
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Support Options */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="text-red-500" size={20} />
                Why Support Us?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Star className="text-yellow-500 mt-1" size={16} />
                <p className="text-sm text-gray-600">
                  Keep Plan_My_Budget free and accessible to everyone
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="text-yellow-500 mt-1" size={16} />
                <p className="text-sm text-gray-600">
                  Fund new features and improvements
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="text-yellow-500 mt-1" size={16} />
                <p className="text-sm text-gray-600">
                  Support ongoing maintenance and hosting
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="text-yellow-500 mt-1" size={16} />
                <p className="text-sm text-gray-600">
                  Enable faster customer support
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="text-purple-500" size={20} />
                What You Get
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Coffee className="text-amber-600 mt-1" size={16} />
                <p className="text-sm text-gray-600">
                  Our eternal gratitude and a virtual coffee!
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Coffee className="text-amber-600 mt-1" size={16} />
                <p className="text-sm text-gray-600">
                  Priority support for any issues
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Coffee className="text-amber-600 mt-1" size={16} />
                <p className="text-sm text-gray-600">
                  Early access to new features (when available)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Coffee className="text-amber-600 mt-1" size={16} />
                <p className="text-sm text-gray-600">
                  A warm feeling knowing you're helping others
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Payment Options */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Support Amount</CardTitle>
              <CardDescription>
                Every contribution helps, no matter the size!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Predefined Amounts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Select
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {predefinedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={
                        selectedAmount === amount && !isCustom
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleAmountSelect(amount)}
                      className="text-sm"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Amount
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Selected Amount Display */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">
                  Selected amount:{" "}
                  <span className="font-semibold text-gray-800">
                    ₹{getFinalAmount().toFixed(0)}
                  </span>
                </p>
              </div>

              {/* Payment Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleUPIPayment}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={getFinalAmount() < 1}
                >
                  <Smartphone className="mr-2" size={16} />
                  Pay with UPI
                </Button>

                <Button
                  onClick={handleRazorpay}
                  variant="outline"
                  className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                  disabled={getFinalAmount() < 1}
                >
                  <CreditCard className="mr-2" size={16} />
                  Razorpay (Cards/Wallets)
                </Button>

                <Button
                  onClick={handlePaytm}
                  variant="outline"
                  className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
                  disabled={getFinalAmount() < 1}
                >
                  <Banknote className="mr-2" size={16} />
                  Paytm
                </Button>
              </div>

              <div className="bg-blue-50 p-3 rounded-md mt-4">
                <p className="text-xs text-blue-700 text-center">
                  <strong>UPI:</strong> Instant payment via any UPI app
                  <br />
                  <strong>Razorpay:</strong> Cards, Net Banking, Wallets
                  <br />
                  <strong>Paytm:</strong> Direct Paytm transfer
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Thank You Message */}
          {user && (
            <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Heart className="text-red-500 mx-auto mb-2" size={24} />
                  <p className="text-sm text-gray-700">
                    Thank you,{" "}
                    <span className="font-semibold">
                      {user.firstName || "friend"}
                    </span>
                    !
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Your support means the world to us and helps keep
                    Plan_My_Budget running.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Section - Additional Info */}
      <div className="mt-12 text-center">
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-2">
              Other Ways to Support
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>⭐ Star our project on GitHub</p>
              <p>📢 Share Plan_My_Budget with friends and colleagues</p>
              <p>🐛 Report bugs and suggest improvements</p>
              <p>💬 Join our community and help other users</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UpgradePage;

import { SignIn } from "@clerk/nextjs";
import { PenTool } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
      linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
    `,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Gradient blobs */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-zinc-900/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-zinc-800/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 flex flex-col items-center justify-center">
        {/* Logo and Branding */}
        <div className="text-center mb-8 w-full">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-lg shadow-zinc-500/50">
              <PenTool className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Scribble
            </h1>
          </div>
          <p className="text-gray-400">Sign in to continue your learning journey</p>
        </div>

        {/* Clerk Sign In */}
        <div className="w-full bg-zinc-900/40 backdrop-blur-sm border border-zinc-700 rounded-xl p-8 shadow-2xl">
          <SignIn
            appearance={{
              elements: {
                card: "bg-transparent border-0 shadow-none",
                headerTitle: "text-white text-2xl font-bold text-center",
                headerSubtitle: "text-gray-400 text-center text-sm",
                formFieldLabel: "text-gray-300 font-medium text-sm",
                formFieldInput:
                  "bg-zinc-800 text-white border border-zinc-700 rounded-lg focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600",
                formButtonPrimary:
                  "bg-white text-black hover:bg-gray-200 font-semibold shadow-lg shadow-zinc-500/50",
                dividerLine: "bg-zinc-700",
                dividerText: "text-gray-400",
                socialButtonsBlockButton:
                  "border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-gray-300",
                socialButtonsBlockButtonText: "text-sm",
                formResendCodeLink: "text-white hover:text-gray-300",
                footerActionLink: "text-white hover:text-gray-300",
                footerActionLinkStatusProcessing: "text-gray-400",
                identifierInputField:
                  "bg-zinc-800 text-white border border-zinc-700 rounded-lg",
              },
              variables: {
                colorPrimary: "#ffffff",
                colorBackground: "transparent",
                colorText: "#ffffff",
                colorInputBackground: "rgba(24, 24, 27, 0.5)",
                colorInputBorder: "rgba(113, 113, 122, 0.5)",
              },
            }}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          New to Scribble?{" "}
          <a href="/sign-up" className="text-white hover:text-gray-300 font-medium">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}

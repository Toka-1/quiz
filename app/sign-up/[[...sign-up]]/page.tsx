import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F4FF] px-4 py-10">
      <SignUp
        forceRedirectUrl="/home"
        signInUrl="/sign-in"
        appearance={{
          variables: {
            colorPrimary: "#6C47FF",
            borderRadius: "0.75rem",
          },
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
      />
    </div>
  );
}

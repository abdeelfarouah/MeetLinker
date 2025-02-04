import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

const AuthForm = () => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      register(email, password, name);
    } else {
      login(email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isRegistering && (
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={isRegistering}
        />
      )}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        {isRegistering ? "Register" : "Login"}
      </Button>
      <button
        type="button"
        onClick={() => setIsRegistering(!isRegistering)}
        className="text-blue-500 hover:underline w-full text-center"
      >
        {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
      </button>
    </form>
  );
};

export default AuthForm;
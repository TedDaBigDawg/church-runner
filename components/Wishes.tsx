"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore, Wish } from "@/store/useStore";
import { LoaderPinwheel, Send } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { addWish } from "@/actions/wishes";
import { pusherClient } from "@/lib/pusher";

interface WishesProps {
  initialWishes: Wish[];
}

export default function Wishes({ initialWishes }: WishesProps) {
  const {
    user,
    updateUserName,
    wishes,
    setWishes,
    addWish: addWishToStore,
  } = useStore();
  const [newWish, setNewWish] = useState({ message: "" });
  const wishesEndRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setWishes(initialWishes);
  }, [initialWishes, setWishes]);

  const scrollToBottom = () => {
    wishesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [wishes]);

  useEffect(() => {
    const channel = pusherClient.subscribe("wishes");
    channel.bind("new-wish", (data: Wish) => {
      addWishToStore(data);
      toast(`New wish from ${data.name}`);
    });

    return () => {
      pusherClient.unsubscribe("wishes");
    };
  }, [addWishToStore]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user && newWish.message) {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("name", user.name);
      formData.append("image", user.image);
      formData.append("message", newWish.message);

      startTransition(async () => {
        const result = await addWish(formData);
        if (result.success) {
          setNewWish({ message: "" });
        } else {
          toast.error("Failed to submit wish. Please try again.");
        }
      });
    }
  };

  return (
    <Card className="bg-white bg-opacity-90 shadow-xl rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-800">
          Share Your Memory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid relative space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <Input
              type="text"
              id="name"
              onChange={(e) => updateUserName(e.target.value)}
              className="mt-1"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700">
              Your Memory
            </label>
            <Textarea
              id="message"
              required
              value={newWish.message}
              onChange={(e) => setNewWish({ message: e.target.value })}
              className="mt-1"
              placeholder="Share your favorite memory of Elder David"
              rows={4}
            />
          </div>

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <LoaderPinwheel className="animate-spin w-4 h-4 mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Share Memory
          </Button>
        </form>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-purple-700">
            Recent Memories
          </h3>
          <ScrollArea className="space-y-4 h-72">
            <div ref={wishesEndRef} />
            <AnimatePresence>
              {wishes.length > 0 ? (
                wishes.map((wish) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}>
                    <Card className="bg-pink-50">
                      <CardContent className="p-4">
                        <p className="text-gray-800">{wish.message}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          - {wish.name}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card className="bg-pink-50">
                  <CardContent className="p-4">
                    <p className="text-gray-800">{"No wishes yet"}</p>
                    <p className="text-sm text-gray-600 mt-2 italic">
                      - {"Admin"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

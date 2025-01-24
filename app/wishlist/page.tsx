/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { Suspense } from "react";
import { CartItemSkeleton } from "../cart/page";
import { getProductByID, getWishlist } from "@/lib/actions/actions";
import { auth } from "@clerk/nextjs/server";
import { get } from "lodash";
import WishlistCard from "@/components/WishlistCard";
import { serializeProducts } from "@/utils/helpers";
import { Button } from "@/components/ui/button";

export default async function Wishlist() {
  const { userId }: { userId: string | null } = await auth();
  if (userId === null) return null;
  const wishlist: string[] = await getWishlist(userId);
  const product_data = await Promise.all(
    wishlist.map(async (item) => await getProductByID(item))
  );
  const newData = serializeProducts(product_data);

  return (
    <>
      <SignedIn>
        <h2 className="text-3xl font-semibold text-center mt-5">
          Your Wishlist
        </h2>
        <div className="flex items-center justify-center flex-1 text-center flex-col space-y-5 mt-5">
          <Suspense fallback={<CartItemSkeleton />}>
            <WishlistCard wishlist={newData} />
          </Suspense>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex items-center justify-center flex-1 text-center flex-col ">
          <h1 className="text-[3rem]">Sign in to access your wishlist!</h1>
          <div className="mt-5 cursor-pointer flex flex-col space-y-4">
            <Link href="/sign-in">
              <span className="bg-blue-500 text-white rounded-md px-4 py-2 text-xl">
                Sign In
              </span>
            </Link>

            <Link href="/sign-up">
              New User?{" "}
              <span className=" text-blue-400 hover:underline hover:text-blue-600">
                Sign Up
              </span>
            </Link>
          </div>
        </div>
      </SignedOut>
    </>
  );
}

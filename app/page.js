"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";


const formSchema = z.object({
  search: z.string().min(2).max(50),
})

export default function Home() {
  const githubURL = "https://api.github.com/users/";
  const [userData, setUserData] = useState(null);
  const [repoData, setRepoData] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  })

  const getUser = async (username) => {
    const response = await fetch(githubURL + username);
    const user = await response.json();
    const repo = getRepos(username);

    setUserData(user);
    setRepoData(repo);
  }

  const getRepos = async (username) => {
    const response = await fetch(githubURL + username + "/repos");
    const repo = await response.json();

    return repo;
  }

  const onSubmit = (values) => {
    const username = values?.search;

    if (username == "") {
      return;
    }

    getUser(username);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-center gap-y-6">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Search a Github user"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form >
      {userData && (
        <Card>
          <CardHeader>
            <Avatar>
              <AvatarImage src={userData?.avatar_url} />
              <AvatarFallback>
                TEST
              </AvatarFallback>
            </Avatar>
            <CardTitle>
              {userData?.name}
            </CardTitle>
            <CardDescription>
              {userData?.bio}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </main>
  )
}

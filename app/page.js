"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchUserData } from "@/utils/githubAPI";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  search: z.string().min(1).max(50),
});

export default function Home() {
  const githubURL = "https://api.github.com/users/";
  const [userData, setUserData] = useState(null);
  const [repoData, setRepoData] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  const onSubmit = async (values) => {
    const username = values?.search;

    if (!username) {
      return;
    }

    const { user, repos } = await fetchUserData(githubURL, username);

    setUserData(user);
    setRepoData(repos);
  };


  return (
    <main className="relative flex flex-col items-center justify-between w-full h-full min-h-screen p-6 sm:p-12 gap-y-6 md:p-20 lg:p-24 bg-gradient-to-r from-indigo-800 to-indigo-600">
      <ModeToggle />
      <section className="flex flex-col items-center justify-between gap-y-6">
        <h1 className="max-w-xl mb-6 text-5xl font-bold tracking-wide uppercase text-primary">GitHub Profile</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center justify-center gap-y-6">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Search a GitHub user"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="sm">Search</Button>
          </form>
        </Form>
      </section>
      {userData && (
        <Card>
          <CardHeader>
            <Avatar>
              {userData.avatar_url ? (
                <AvatarImage src={userData.avatar_url} alt={`Avatar of ${userData.login}`} />
              ) : (
                <AvatarFallback>{userData.login[0]}</AvatarFallback>
              )}
            </Avatar>
            <CardTitle>{userData.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{userData.bio}</CardDescription>
            <div className="flex items-center mt-4 gap-x-2">
              <Badge>{userData.followers} Followers</Badge>
              <Badge>{userData.following} Following</Badge>
            </div>
          </CardContent>
        </Card>
      )}
      {repoData && (
        <Card>
          <CardHeader>
            <CardTitle>Repositories</CardTitle>
          </CardHeader>
          <CardContent>
            {repoData.map((repo) => (
              <div key={repo.id} className="mb-4">
                <h1 className="text-2xl font-bold">{repo.name}</h1>
                <CardDescription>{repo.description}</CardDescription>
                <div className="flex items-center mt-2 gap-x-2">
                  <Badge>Language: {repo.language}</Badge>
                  <Badge>Stars: {repo.stargazers_count}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </main>
  );
}

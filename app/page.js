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
import { PersonIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { Backpack, Building, Eye, Forklift } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  search: z.string().min(1).max(50),
});

export default function Home() {
  const githubURL = "https://api.github.com/users/";
  const [userData, setUserData] = useState(null);
  const [repoData, setRepoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    const username = values?.search;

    if (!username) {
      setIsLoading(false);
      return;
    }

    const { user, repos } = await fetchUserData(githubURL, username);

    setUserData(user);
    setRepoData(repos);
    setIsLoading(false);
  };


  return (
    <main className="relative flex flex-col items-center justify-start w-full h-full min-h-screen p-6 sm:p-12 gap-y-6 md:p-20 lg:p-24 dark:bg-[#1F242A]">
      <nav className="absolute flex items-center justify-between w-full px-6 top-4">
        <ModeToggle />
      </nav>
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
      {isLoading ? (
        <>
          <div className="flex flex-col items-center gap-6 lg:flex-row">
            {/* User Avatar Skeleton */}
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex flex-col gap-2">
              {/* User Name Skeleton */}
              <Skeleton className="h-6 w-[250px]" />
              {/* User Bio Skeleton */}
              <Skeleton className="h-4 w-[300px]" />
              {/* Company Badge Skeleton */}
              <div className="flex items-center gap-1">
                <Skeleton className="w-16 h-4" />
              </div>
              {/* Followers/Following/Repos Skeleton */}
              <div className="flex items-center justify-center gap-x-2">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-20 h-4" />
              </div>
            </div>
          </div>
          <div>
            {/* Repos skeleton */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array(4).fill().map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-32" />
                  <div className="mt-2">
                    {/* Repo Name Skeleton */}
                    <Skeleton className="h-4 w-[200px]" />
                    {/* Repo Info Skeleton */}
                    <div className="flex items-center mt-1 gap-x-2">
                      <Skeleton className="w-12 h-4" />
                      <Skeleton className="w-20 h-4" />
                      <Skeleton className="w-20 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {userData && (
            <Card className="max-w-[1000px] w-full">
              <CardHeader className="gap-6">
                <div className="flex flex-col items-center gap-6 lg:flex-row">
                  <Avatar className="border-[10px] border-[#2a2a72] w-[150px] h-[150px]">
                    {userData.avatar_url ? (
                      <AvatarImage src={userData.avatar_url} alt={`Avatar of ${userData.login}`} />
                    ) : (
                      <AvatarFallback>{userData.login[0]}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col items-center gap-2 lg:items-start">
                    <CardTitle className="text-center lg:text-left">
                      {userData?.name ? userData.name : `(No Name Available)`}
                    </CardTitle>
                    <CardDescription className="text-center lg:text-left">
                      {userData?.bio}
                    </CardDescription>
                    {userData.company && (
                      <div className="flex items-center justify-center mt-4 lg:items-start lg:justify-start gap-x-2">
                        <Badge className="flex gap-1 py-1" variant="secondary"><Building /> {userData.company}</Badge>
                      </div>
                    )}
                    <div className="flex items-center justify-center mt-4 lg:items-start lg:justify-start gap-x-2">
                      <Badge className="flex gap-1"><PersonIcon /> {userData.followers} Followers</Badge>
                      <Badge>{userData.following} Following</Badge>
                      <Badge>{userData.public_repos} Public Repositories</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}
          {repoData.length > 0 && (
            <Card className="w-full max-w-[1000px]">
              <CardHeader>
                <CardTitle>Public Repositories</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {repoData.map((repo) => (
                  <a target="_blank" href={repo.html_url} key={repo.id}>
                    <Card className="mb-4">
                      <CardHeader>
                        <CardTitle>{repo.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center mt-2 gap-x-2">
                          {repo.language && <Badge>{repo.language}</Badge>}
                          <Badge className="flex gap-1 bg-yellow-300 dark:bg-yellow-500 dark:text-white text-ghdarkgray">
                            <StarFilledIcon />
                            {repo.stargazers_count}
                          </Badge>
                          <Badge className="flex gap-1">
                            <Eye className="w-4 h-4" />
                            {repo.watchers}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </main>
  );
}

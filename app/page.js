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
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";


const formSchema = z.object({
  search: z.string().min(1).max(50),
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

  const getData = async (username) => {
    const user_response = await fetch(githubURL + username);
    const repo_response = await fetch(githubURL + username + "/repos");

    const user = await user_response.json();
    const repo = await repo_response.json();

    setUserData(user);
    setRepoData(repo);
  }

  const onSubmit = (values) => {
    const username = values?.search;

    if (username == "") {
      return;
    }

    getData(username);
  }

  return (
    <main className="flex flex-col items-center justify-between w-full h-full min-h-screen p-6 border sm:p-12 gap-y-6 md:p-20 lg:p-24">
      <section className='flex flex-col items-center justify-between gap-y-6'>
        <h1 className='max-w-xl mb-6 text-5xl font-bold tracking-wide uppercase text-primary'>Github Profile</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center justify-center border gap-y-6">
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
            <Button type="submit" size="sm">Search</Button>
          </form>
        </Form >
        {userData && (
          <Card className="max-w-[800px] w-full">
            {userData.message ? (
              <div className="m-4 text-2xl text-center">User Not Found</div>
            ) : (
              <>
                <CardHeader className="gap-6">
                  <div className="flex flex-col items-center gap-6 md:flex-row">
                    <Avatar className="mx-auto border-[10px] border-[#2a2a72] w-[150px] h-[150px] md:w-[100px] md:h-[100px] lg:w-[150px] lg:h-[150px]">
                      <AvatarImage src={userData?.avatar_url} alt="Avatar Image" className="" />
                      <AvatarFallback>
                        No Image
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center gap-2 md:items-start">
                      <CardTitle className="text-center md:text-left">
                        {userData?.name} ({userData?.login})
                      </CardTitle>
                      <CardDescription className="text-center md:text-left">
                        {userData?.bio}
                      </CardDescription>
                    </div>
                  </div >

                  <ul className="grid items-center grid-cols-1 gap-4 md:grid-cols-3">
                    <li>
                      <strong>Followers:</strong> {userData?.followers}
                    </li>
                    <li>
                      <strong>Following:</strong> {userData?.following}
                    </li>
                    <li>
                      <strong>Public Repositories:</strong> {userData?.public_repos}
                    </li>
                  </ul>
                </CardHeader >
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {repoData && repoData.map((repo, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle>{repo.name}</CardTitle>
                        {repo.description && <CardDescription>{repo.description}</CardDescription>}
                      </CardHeader>
                    </Card>
                  ))}
                </CardContent>
              </>
            )}
          </Card >
        )}
      </section>
      <section className='flex items-center justify-center'>
        <h1 className='font-bold'>Created By: Ronald Vergel Dela Cruz</h1>
      </section>
    </main >
  )
}

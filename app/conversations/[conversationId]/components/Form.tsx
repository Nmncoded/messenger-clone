"use client";
import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import React, { useMemo } from "react";
import { HiChevronLeft, HiEllipsisHorizontal, HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import useConversation from "@/app/hooks/useConversation";
import { FieldValue, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import MessageInput from "./MessageInput";
import {CldUploadButton} from 'next-cloudinary'
 
interface FormProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Form: React.FC<FormProps> = ({ conversation }) => {
  const {conversationId} = useConversation();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  })

  const onSubmit:SubmitHandler<FieldValues> = (data) => {
    setValue('message', '',{shouldValidate: true});

    axios.post('/api/messages',{
      ...data,
      conversationId: conversationId
    })
  }
  
  const handleUpload = (data:any) => {
    // console.log(data);
    axios.post('/api/messages',{
      image : data?.info?.secure_url,
      conversationId: conversationId
    })
  }

  return <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full" >
    <CldUploadButton options={{maxFiles: 1}} onSuccess={handleUpload} uploadPreset="srefybu6" >
      <HiPhoto size={30} className="text-sky-500" />
    </CldUploadButton>
    <form className="flex items-center gap-2 lg:gap-4 w-full" onSubmit={handleSubmit(onSubmit)} >
      <MessageInput id="message" register={register} errors={errors} required placeholder="Write a message" />
      <button type="submit" className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition" >
        <HiPaperAirplane size={18} className="text-white" />
      </button>
    </form>
  </div>;
};

export default Form;

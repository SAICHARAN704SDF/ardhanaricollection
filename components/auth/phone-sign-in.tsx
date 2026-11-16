'use client';
import { useAuth, useSignIn, useSignUp } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function PhoneSignIn(){
  const {isLoaded,isSignedIn}=useAuth();
  const {signIn}=useSignIn();
  const {signUp}=useSignUp();
  const router=useRouter();
  const [phone,setPhone]=useState('+91');
  const [code,setCode]=useState('');
  const [mode,setMode]=useState<'sign-in'|'sign-up'>('sign-in');
  const [sent,setSent]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [cooldown,setCooldown]=useState(0);
  useEffect(()=>{if(isSignedIn)router.replace('/checkout');},[isSignedIn,router]);
  useEffect(()=>{if(!cooldown)return;const timer=setTimeout(()=>setCooldown(c=>c-1),1000);return()=>clearTimeout(timer);},[cooldown]);
  function fail(value: {message?:string;longMessage?:string}|null){
    if(value)throw new Error(value.longMessage||value.message||'Verification is unavailable. Please try again.');
  }
  async function send(){
    if(busy||cooldown)return;
    setBusy(true);setError('');
    try{
      const number=phone.replace(/[\s()-]/g,'');
      if(!/^\+[1-9]\d{7,14}$/.test(number))throw new Error('Enter your phone number with country code, for example +91 followed by your 10-digit mobile number.');
      if(mode==='sign-in'){
        const result=await signIn.create({identifier:number});fail(result.error);
        fail((await signIn.phoneCode.sendCode({phoneNumber:number})).error);
      }else{
        if(!sent)fail((await signUp.create({phoneNumber:number})).error);
        fail((await signUp.verifications.sendPhoneCode()).error);
      }
      setPhone(number);setSent(true);setCooldown(30);
    }catch(e){setError(e instanceof Error?e.message:'Could not send the code. Please try again.');}
    finally{setBusy(false);}
  }
  async function verify(){
    if(busy)return;setBusy(true);setError('');
    try{
      if(mode==='sign-in'){
        fail((await signIn.phoneCode.verifyCode({code})).error);
        if(signIn.status!=='complete')throw new Error('Additional account verification is required. Please contact support.');
        fail((await signIn.finalize({navigate:({session})=>{if(session?.currentTask){setError('Your account needs an additional verification step.');return;}router.replace('/checkout');}})).error);
      }else{
        fail((await signUp.verifications.verifyPhoneCode({code})).error);
        if(signUp.status!=='complete')throw new Error('Phone-only registration is not configured yet. Please contact the store.');
        fail((await signUp.finalize({navigate:({session})=>{if(session?.currentTask){setError('Your account needs an additional verification step.');return;}router.replace('/checkout');}})).error);
      }
    }catch(e){setError(e instanceof Error?e.message:'Could not verify the code.');}
    finally{setBusy(false);}
  }
  return <div className="phone-auth">
    <h2>{sent?'Verify your number':mode==='sign-in'?'Sign in with your phone':'Create your account'}</h2>
    <p>{sent?`Enter the SMS code sent to ${phone}.`:'Your favourites and bag stay with you. No email or password needed.'}</p>
    <form onSubmit={e=>{e.preventDefault();void(sent?verify():send());}}>
      {!sent?<><label htmlFor="customer-phone">Mobile number</label><input id="customer-phone" type="tel" autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)} required aria-describedby="phone-help"/><span id="phone-help" className="tiny">Include your country code. India: +91.</span></>:<><label htmlFor="phone-code">Verification code</label><input id="phone-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))} required/></>}
      {error&&<p role="alert" className="phone-error">{error}</p>}
      <button className="button primary" disabled={!isLoaded||busy||!!isSignedIn} type="submit">{busy?'Please wait…':sent?'Verify & continue to checkout':'Send verification code'}</button>
    </form>
    {sent?<><button className="text-link" disabled={busy||cooldown>0} onClick={()=>void send()}>{cooldown?`Resend code in ${cooldown}s`:'Resend code'}</button><button className="text-link" disabled={busy} onClick={()=>{setSent(false);setCode('');setError('');setCooldown(0);}}>Change phone number</button></>:<button className="text-link" disabled={busy} onClick={()=>{setMode(mode==='sign-in'?'sign-up':'sign-in');setError('');}}>{mode==='sign-in'?'New to Ardhanari? Create an account':'Already have an account? Sign in'}</button>}
    <Link href="/cart" className="text-link">Return to your bag</Link>
    <div id="clerk-captcha"/>
  </div>;
}

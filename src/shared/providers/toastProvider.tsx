'use client';

import React from 'react';
import { ToastContainer } from 'react-toastify';
/*
      position: 토스트가 나타날 위치
      autoClose: 토스트가 자동으로 사라지는 시간(밀리초)
      hideProgressBar: 토스트 아래의 진행바를 숨길지 여부
      newestOnTop: 최신 알림이 스택의 맨 위로
      closeOnClick: 토스트를 클릭하면 닫힘
      pauseOnFocusLoss: 브라우저 탭을 바꿀 때 토스트 타이머를 일시 정지
      draggable: 토스트를 드래그 할 수 있게 함
      pauseOnHover: 마우스를 올리면 토스트 타이머를 일시 정지합니다.
      theme: 토스트의 테마
    */

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
        toastClassName='whitespace-pre-line'
      />
    </>
  );
}

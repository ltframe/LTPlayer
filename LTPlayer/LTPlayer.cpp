// LTPlayer.cpp : ����Ӧ�ó������ڵ㡣
//

#include "stdafx.h"
#include "UIClass.h"

#define MAX_LOADSTRING 100
// ȫ�ֱ���:
HINSTANCE hInst;								// ��ǰʵ��
TCHAR szTitle[MAX_LOADSTRING];					// �������ı�
TCHAR szWindowClass[MAX_LOADSTRING] = L"SDFDSFADFSADF";			// ����������
static HINSTANCE wbcorehandle=0;

// �˴���ģ���а����ĺ�����ǰ������:

INT_PTR CALLBACK	About(HWND, UINT, WPARAM, LPARAM);

int APIENTRY _tWinMain(HINSTANCE hInstance,
                     HINSTANCE hPrevInstance,
                     LPTSTR    lpCmdLine,
                     int       nCmdShow)
{


	HANDLE hMutex = ::CreateMutex(NULL,FALSE,L"8B425E21-43F1-49BB-9170-15092CC84B4C");
	if (::GetLastError()==ERROR_ALREADY_EXISTS)
	{
		::ReleaseMutex(hMutex);
		::CloseHandle( hMutex );
		 return 0;  
	}


	OSVERSIONINFO osvi;

	ZeroMemory(&osvi, sizeof(OSVERSIONINFO));
	osvi.dwOSVersionInfoSize = sizeof(OSVERSIONINFO);

	GetVersionEx(&osvi);
	if (osvi.dwMajorVersion<5)
	{
		MessageBox(NULL,_T("����ʹ�ò���ϵͳ�汾����,�޷�����ʹ�ñ�������"),_T("�����������ֲ�����"),MB_ICONERROR);
		return FALSE;	
	}

	UIClass * uiclass=new UIClass();
	return 1;
}



//
//  ����: MyRegisterClass()
//
//  Ŀ��: ע�ᴰ���ࡣ
//
//  ע��:
//
//    ����ϣ��
//    �˴�������ӵ� Windows 95 �еġ�RegisterClassEx��
//    ����֮ǰ�� Win32 ϵͳ����ʱ������Ҫ�˺��������÷������ô˺���ʮ����Ҫ��
//    ����Ӧ�ó���Ϳ��Ի�ù�����
//    ����ʽ��ȷ�ġ�Сͼ�ꡣ
//

//
//   ����: InitInstance(HINSTANCE, int)
//
//   Ŀ��: ����ʵ�����������������
//
//   ע��:
//
//        �ڴ˺����У�������ȫ�ֱ����б���ʵ�������
//        ��������ʾ�����򴰿ڡ�
//

// �����ڡ������Ϣ�������
INT_PTR CALLBACK About(HWND hDlg, UINT message, WPARAM wParam, LPARAM lParam)
{
	UNREFERENCED_PARAMETER(lParam);
	switch (message)
	{
	case WM_INITDIALOG:
		return (INT_PTR)TRUE;

	case WM_COMMAND:
		if (LOWORD(wParam) == IDOK || LOWORD(wParam) == IDCANCEL)
		{
			EndDialog(hDlg, LOWORD(wParam));
			return (INT_PTR)TRUE;
		}
		break;
	}
	return (INT_PTR)FALSE;
}

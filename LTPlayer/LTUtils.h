// ���� ifdef ���Ǵ���ʹ�� DLL �������򵥵�
// ��ı�׼�������� DLL �е������ļ��������������϶���� LTUTILS_EXPORTS
// ���ű���ġ���ʹ�ô� DLL ��
// �κ�������Ŀ�ϲ�Ӧ����˷��š�������Դ�ļ��а������ļ����κ�������Ŀ���Ὣ
// LTUTILS_API ������Ϊ�Ǵ� DLL ����ģ����� DLL ���ô˺궨���
// ������Ϊ�Ǳ������ġ�


#ifndef _LTUtils_H
#define _LTUtils_H
#include "bass.h"
#include "tags.h"
#include "ConstValue.h"
#include <string.h>
#include <string>
#include <iostream>
#include <windows.h>
#include <vector>
using namespace std;



class  CLTCommon{
public:
	CLTCommon(void);
	static char* ConvertWCharToChar(wchar_t* s);
	static wchar_t* AnsiToWideChar(char* aaa);
	static char* GetFileInfo(char* filepath);
	static char* ReplaceFilePath(char* _str,char* str1,char* repstr1);
	static char* Seconds2Time(int sec);
	static void SetConfig(AppConfigInfo info);
	static void WriteFile(char* str,char* path,int isappend);
	static char* GetFile(char* path);
	static char* GetApplicationPath();
	static const char* CreateGUID();
	static void SplitSTLString(string strSrc ,vector<string>& vecDest ,char cSeparator);
	static bool IsStrInStrAarry(char * str,char* strstr);
	static void string_replace(std::string& strBig, const std::string & strsrc, const std::string &strdst);
	static char* GetFileExt(wchar_t* str);
	static bool FileExists(char * filepath);
	static bool CheckAllTemplateFile(char*);
	static bool GetContentMD5( BYTE *pszFilePath,BOOL bFile,BOOL bUpperCase,TCHAR *pszResult,DWORD &dwStatus);
	//static void FreeHeap(void* heap);
	//static AppConfigInfo GetConfig();
};

class  LTMusic
{
public:
	LTMusic(HWND m_hWnd);
	~LTMusic(void);
	 MusicBasicInfo GetMusicBasicInformation(char* filepath);
	 double  GetMusicSeconds(HSTREAM m_stream);
	 double GetCurrentMusicSeconds();
	 char* Seconds2Time(int sec);
	 bool MusicPlay(wchar_t* filename);
	 void MusicStop();
	 double CurrentMusicTime();
	 HSTREAM GetMusicHand();
	 int  GetMusicStatus();
	 void SetMusicPosition(double seconds);
	 void SetMusicVolume(float volume);
	 bool LTMusic::IsPlayMusic();
private:
	HSTREAM m_stream;
};




//// �����Ǵ� LTUtils.dll ������
//class LTUTILS_API CLTJson {
//public:
//	CLTJson(void);
//	void GetJsonRoot(wchar_t* str,Json::Value& root);
//	//Json::Value GetJsonRootP(wchar_t* s);
//	// TODO: �ڴ�������ķ�����
//};
#endif
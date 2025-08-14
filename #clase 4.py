#clase 4

# ejercicio 5   clase 3
cadena=input("ingresa un palindrimo:")
print(len(cadena))

for i in range( len(cadena)//2):
    letrainicio=i
    letrafinal=len(cadena)-1-i
    if cadena[letrainicio]!=cadena[letrafinal]:
        print("No es un palindromo")
        break
else:
    print("Es un palindromo")



for i in range(4):
    print("pepe a la",i)


#ejercicio1 clase 4 

edad = int(input("Digita tu edad: "))

if edad >= 18:
    print("Eres mayor, puedes votar")
else:
    print("Eres menor, no puedes votar")


#ejercicio 2 clase 4

numero1=int(input("ingrese un numero: "))
numero2=int(input("ingrese un segundo numero: "))

if(numero1>numero2):
  print("el numero mayor es el 1")

elif(numero2>numero1):
  print("el numero mayor es el 2")

elif(numero1==numero2):
  print("los numeros son iguales ")



#ejercicio 3 determinar si un numero es par oh impar

numerO=int(input("ingrese un numero: "))
if numerO%2==0:
  print(" es par")
else:
  print(" es impar")


 
#ejercicio4

nota=int(input("ingrese la nota: "))
if nota >=90 and nota < 100:
  print("exelente")
if nota >=70 and nota < 89:
  print("bueno")
if nota >=69 and nota <50:
  print("regular")
if nota <=50:
 print(" perdio la materia")

if nota > 100:
  print("las notas debe ser de 0 a 100 ")


#ejercicio5

usuario=(input("ingresa el usuario: "))
contraseña=(input("ingresa la contraseña:"))

if (usuario=="admin" and contraseña=="1234"):
  print(" acceso permitido")

else:
  print("  acceso denegado")

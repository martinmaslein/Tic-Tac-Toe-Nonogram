:- module(proylcc,
	[  
		put/8
	]).

:-use_module(library(lists)).


replace(X, 0, Y, [X|Xs], [Y|Xs]).

replace(X, XIndex, Y, [Xi|Xs], [Xi|XsY]):-
    XIndex > 0,
    XIndexS is XIndex - 1,
    replace(X, XIndexS, Y, Xs, XsY).

put(Contenido, [RowN, ColN], PistasFilas, PistasColumnas, Grilla, NewGrilla, FilaSat, ColSat):-
	
    replace(Row, RowN, NewRow, Grilla, NewGrilla),
	(replace(Cell, ColN, _, Row, NewRow),
        
	Cell == Contenido 
		;
	replace(_Cell, ColN, Contenido, Row, NewRow)),
    
    nth0(RowN, PistasFilas, PistasDeLaFila),     % Posicion dentro de PistasFilas
    
    nth0(ColN, PistasColumnas, PistasDeLaColumna),        % Posicion dentro de PistasFilas
    
    obtenerFila(RowN, NewGrilla, ListaFil),     % Fila donde hice el click para revisar pistas
    
    obtenerColumna(ColN, NewGrilla, ListaColumna),   % Columna donde hice el click para revisar pistas
    
    verificarFila(PistasDeLaFila, ListaFil, FilaSat),   % Verifica que haya cantidad de pistas en la fila
    													
    verificarColumna(PistasDeLaColumna, ListaColumna, ColSat).   % Verifica que haya cantidad de pistas en la columna

obtenerFila(N, Matriz, Fila):-
    nth0(N, Matriz, Fila).

obtenerColumna(Indice, Matriz, Columna):-
    getColumnaAux(Indice,Matriz,[],Columna).
    
getColumnaAux(_,[],In,In).
getColumnaAux(Indice,[X|Xs],In,Out):-
    nth0(Indice,X,Elem),
    append(In,[Elem],Aux),
    getColumnaAux(Indice,Xs,Aux,Out).
% -----------------------------------------------------

noHashtagEnLista([]). 
noHashtagEnLista([Head | Tail]):-
	Head \== "#",
	noHashtagEnLista(Tail).

% -----------------------------------------------------
verificarLongitudHashtag(0, [], []).
verificarLongitudHashtag(0, [X|Xs], [X|Xs]):-
    X \== "#".
verificarLongitudHashtag(P, [X|Xs], Res):-
    X == "#",
    P1 is P-1,
    verificarLongitudHashtag(P1, Xs, Res).

% -----------------------------------------------------

verificarPistasEnLista([], Lista, _Sat):- 
    noHashtagEnLista(Lista).
verificarPistasEnLista([P|Ps], [X|Xs], _Sat):-
    X == "#",
    verificarLongitudHashtag(P, [X|Xs], Rta),
    verificarPistasEnLista(Ps, Rta, Rta).
verificarPistasEnLista([P|Ps], [X|Xs], Sat):-
    X \== "#",
    verificarPistasEnLista([P|Ps], Xs, Sat).
	
% -----------------------------------------------------

verificarFila(PistasDeLaFila, ListaFil, 1):-
    verificarPistasEnLista(PistasDeLaFila, ListaFil, _FilaSat).
verificarFila(_PistasDeLaFila, _ListaFil, 0).

verificarColumna(PistasDeLaCol, ListaCol, 1):-
    verificarPistasEnLista(PistasDeLaCol, ListaCol, _ColSat). 
verificarColumna(_PistasDeLaCol, _ListaCol, 0).
